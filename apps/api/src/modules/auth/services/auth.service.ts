import type { AuthResponse, LoginInput, RegisterInput } from "@bomberman/types";
import argon2 from "argon2";

import { ConflictError, UnauthorizedError } from "@/common/errors";
import { prisma } from "@/database/prisma";

import { toPrivateUser } from "../mappers/auth.mapper";
import { authRepository } from "../repositories/auth.repository";
import { hashRefreshToken, issueAccessToken, issueRefreshToken } from "./token.service";

interface ClientContext {
  userAgent: string | null;
  ip: string | null;
}

interface IssuedSession {
  response: AuthResponse;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

async function loadAvatarUrl(uploadId: string | null): Promise<string | null> {
  if (!uploadId) {
    return null;
  }
  const upload = await prisma.upload.findUnique({ where: { id: uploadId } });
  return upload?.url ?? null;
}

async function buildSession(
  user: Awaited<ReturnType<typeof authRepository.findUserById>>,
  context: ClientContext,
): Promise<IssuedSession> {
  if (!user) {
    throw new UnauthorizedError();
  }
  const access = await issueAccessToken({ sub: user.id, username: user.username });
  const refresh = issueRefreshToken();
  await authRepository.createRefreshToken({
    userId: user.id,
    tokenHash: refresh.tokenHash,
    expiresAt: refresh.expiresAt,
    userAgent: context.userAgent,
    ip: context.ip,
  });
  const avatarUrl = await loadAvatarUrl(user.avatarUploadId);
  return {
    response: {
      user: toPrivateUser(user, avatarUrl),
      accessToken: access.token,
      expiresIn: access.expiresIn,
    },
    refreshToken: refresh.token,
    refreshTokenExpiresAt: refresh.expiresAt,
  };
}

export class AuthService {
  async register(input: RegisterInput, context: ClientContext): Promise<IssuedSession> {
    const username = input.username.toLowerCase();
    const email = input.email.toLowerCase();

    const existingByUsername = await authRepository.findUserByUsername(username);
    if (existingByUsername) {
      throw new ConflictError("Username já está em uso.");
    }
    const existingByEmail = await authRepository.findUserByEmail(email);
    if (existingByEmail) {
      throw new ConflictError("E-mail já está em uso.");
    }

    const passwordHash = await argon2.hash(input.password, { type: argon2.argon2id });
    const user = await authRepository.createUser({ username, email, passwordHash });
    return buildSession(user, context);
  }

  async login(input: LoginInput, context: ClientContext): Promise<IssuedSession> {
    const identifier = input.identifier.toLowerCase();
    const user = identifier.includes("@")
      ? await authRepository.findUserByEmail(identifier)
      : await authRepository.findUserByUsername(identifier);

    if (!user) {
      throw new UnauthorizedError("Credenciais inválidas.");
    }

    const ok = await argon2.verify(user.passwordHash, input.password);
    if (!ok) {
      throw new UnauthorizedError("Credenciais inválidas.");
    }

    return buildSession(user, context);
  }

  async refresh(rawToken: string, context: ClientContext): Promise<IssuedSession> {
    const tokenHash = hashRefreshToken(rawToken);
    const existing = await authRepository.findActiveRefreshToken(tokenHash);
    if (!existing) {
      throw new UnauthorizedError("Sessão expirada.");
    }
    await authRepository.revokeRefreshToken(existing.id);
    const user = await authRepository.findUserById(existing.userId);
    return buildSession(user, context);
  }

  async logout(rawToken: string | null): Promise<void> {
    if (!rawToken) {
      return;
    }
    const tokenHash = hashRefreshToken(rawToken);
    const existing = await authRepository.findActiveRefreshToken(tokenHash);
    if (!existing) {
      return;
    }
    await authRepository.revokeRefreshToken(existing.id);
  }
}

export const authService = new AuthService();
