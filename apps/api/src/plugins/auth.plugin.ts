import type { Role } from "@prisma/client";
import { Elysia } from "elysia";

import { ForbiddenError, UnauthorizedError } from "@/common/errors";
import { authRepository } from "@/modules/auth/repositories/auth.repository";
import { type AccessTokenPayload, verifyAccessToken } from "@/modules/auth/services/token.service";
import { readAccessToken } from "@/modules/auth/utils/auth-cookies";

export interface AuthContextUser {
  id: string;
  username: string;
  role: Role;
}

function extractBearerToken(authorization: string | null): string | null {
  if (!authorization) {
    return null;
  }
  const [scheme, value] = authorization.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !value) {
    return null;
  }
  return value;
}

export const authPlugin = new Elysia({ name: "auth" }).derive(
  { as: "global" },
  async ({ request }): Promise<{ currentUser: AuthContextUser | null }> => {
    const token =
      readAccessToken(request) ?? extractBearerToken(request.headers.get("authorization"));
    if (!token) {
      return { currentUser: null };
    }
    try {
      const payload: AccessTokenPayload = await verifyAccessToken(token);
      const user = await authRepository.findUserById(payload.sub);
      if (!user || user.bannedAt) {
        return { currentUser: null };
      }
      return {
        currentUser: {
          id: payload.sub,
          username: payload.username,
          role: payload.role,
        },
      };
    } catch {
      return { currentUser: null };
    }
  },
);

export function requireAuth(currentUser: AuthContextUser | null): AuthContextUser {
  if (!currentUser) {
    throw new UnauthorizedError();
  }
  return currentUser;
}

export function requireAdmin(currentUser: AuthContextUser | null): void {
  const user = requireAuth(currentUser);
  if (user.role !== "ADMIN") {
    throw new ForbiddenError("Acesso restrito a administradores.");
  }
}
