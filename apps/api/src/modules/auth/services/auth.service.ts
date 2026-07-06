import type { AuthResponse, LoginInput, RegisterInput } from "@bomberman/types";

import { ConflictError, ForbiddenError, UnauthorizedError } from "@/common/errors";
import { usersRepository } from "@/modules/users/repositories/users.repository";

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

function assertNotBanned(user: { bannedAt: Date | null }): void {
  if (user.bannedAt) {
    throw new ForbiddenError("Conta suspensa.");
  }
}

async function buildSession(
  user: Awaited<ReturnType<typeof authRepository.findUserById>>,
  context: ClientContext,
): Promise<IssuedSession> {
  if (!user) {
    throw new UnauthorizedError();
  }
  assertNotBanned(user);
  const access = await issueAccessToken({ sub: user.id, username: user.username, role: user.role });
  const refresh = issueRefreshToken();
  await authRepository.createRefreshToken({
    userId: user.id,
    tokenHash: refresh.tokenHash,
    expiresAt: refresh.expiresAt,
    userAgent: context.userAgent,
    ip: context.ip,
  });
  const avatarUrl = await usersRepository.findAvatarUrl(user.avatarUploadId);
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

const REFRESH_REUSE_GRACE_MS = 60_000;

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

    const passwordHash = await Bun.password.hash(input.password, { algorithm: "argon2id" });
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

    const ok = await Bun.password.verify(input.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedError("Credenciais inválidas.");
    }

    return buildSession(user, context);
  }

  async getActiveUser(userId: string) {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new UnauthorizedError();
    }
    assertNotBanned(user);
    return user;
  }

  async refresh(rawToken: string, context: ClientContext): Promise<IssuedSession> {
    const tokenHash = hashRefreshToken(rawToken);
    const existing = await authRepository.findActiveRefreshToken(tokenHash);
    if (existing) {
      await authRepository.revokeRefreshToken(existing.id);
      const user = await authRepository.findUserById(existing.userId);
      return buildSession(user, context);
    }

    const reused = await authRepository.findRecentlyRevokedRefreshToken(
      tokenHash,
      REFRESH_REUSE_GRACE_MS,
    );
    if (reused) {
      const user = await authRepository.findUserById(reused.userId);
      return buildSession(user, context);
    }

    throw new UnauthorizedError("Sessão expirada.");
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
