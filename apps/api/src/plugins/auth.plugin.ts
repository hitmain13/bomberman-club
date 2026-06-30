import { Elysia } from "elysia";

import { UnauthorizedError } from "@/common/errors";
import { type AccessTokenPayload, verifyAccessToken } from "@/modules/auth/services/token.service";

export interface AuthContextUser {
  id: string;
  username: string;
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
    return { currentUser: { id: payload.sub, username: payload.username } };
  },
);

export function requireAuth(currentUser: AuthContextUser | null): AuthContextUser {
  if (!currentUser) {
    throw new UnauthorizedError();
  }
  return currentUser;
}
