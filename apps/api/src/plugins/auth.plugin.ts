import type { Role } from "@prisma/client";
import { Elysia } from "elysia";

import { ForbiddenError, UnauthorizedError } from "@/common/errors";
import { type AccessTokenPayload, verifyAccessToken } from "@/modules/auth/services/token.service";

export interface AuthContextUser {
  id: string;
  username: string;
  role: Role;
}

function extractToken(authorization: string | null): string | null {
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
    const authorization = request.headers.get("authorization");
    const token = extractToken(authorization);
    if (!token) {
      return { currentUser: null };
    }
    const payload: AccessTokenPayload = await verifyAccessToken(token);
    return {
      currentUser: {
        id: payload.sub,
        username: payload.username,
        role: payload.role,
      },
    };
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
