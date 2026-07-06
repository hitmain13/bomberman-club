import { loginInputSchema, registerInputSchema } from "@bomberman/types";
import { Elysia } from "elysia";

import { parseOrThrow } from "@/common/validation";
import { usersRepository } from "@/modules/users/repositories/users.repository";
import { rateLimit } from "@/plugins/rate-limit.plugin";

import { toPrivateUser } from "../mappers/auth.mapper";
import { authService } from "../services/auth.service";
import { getAccessTokenExpiresIn, verifyAccessToken } from "../services/token.service";
import {
  clearSessionCookies,
  readAccessToken,
  readRefreshToken,
  setSessionCookies,
} from "../utils/auth-cookies";

function getClientContext(request: Request): { userAgent: string | null; ip: string | null } {
  return {
    userAgent: request.headers.get("user-agent"),
    ip:
      request.headers.get("cf-connecting-ip") ??
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      null,
  };
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

export const authController = new Elysia({ prefix: "/auth" })
  .use(rateLimit("auth", { windowMs: 60_000, max: 30 }))
  .get("/session", async ({ set, request }) => {
    const token =
      readAccessToken(request) ?? extractBearerToken(request.headers.get("authorization"));
    if (!token) {
      set.status = 401;
      return { error: { code: "unauthorized", message: "Sessão não encontrada." } };
    }

    try {
      const payload = await verifyAccessToken(token);
      const user = await authService.getActiveUser(payload.sub);
      const avatarUrl = await usersRepository.findAvatarUrl(user.avatarUploadId);
      return {
        user: toPrivateUser(user, avatarUrl),
        accessToken: token,
        expiresIn: getAccessTokenExpiresIn(token),
      };
    } catch {
      set.status = 401;
      return { error: { code: "unauthorized", message: "Sessão expirada." } };
    }
  })
  .use(rateLimit("auth-refresh", { windowMs: 60_000, max: 20 }))
  .post("/register", async ({ body, set, request }) => {
    const input = parseOrThrow(registerInputSchema, body);
    const session = await authService.register(input, getClientContext(request));
    setSessionCookies(set, {
      accessToken: session.response.accessToken,
      accessExpiresIn: session.response.expiresIn,
      refreshToken: session.refreshToken,
      refreshExpiresAt: session.refreshTokenExpiresAt,
    });
    return session.response;
  })
  .post("/login", async ({ body, set, request }) => {
    const input = parseOrThrow(loginInputSchema, body);
    const session = await authService.login(input, getClientContext(request));
    setSessionCookies(set, {
      accessToken: session.response.accessToken,
      accessExpiresIn: session.response.expiresIn,
      refreshToken: session.refreshToken,
      refreshExpiresAt: session.refreshTokenExpiresAt,
    });
    return session.response;
  })
  .post("/refresh", async ({ set, request }) => {
    const token = readRefreshToken(request);
    if (!token) {
      set.status = 401;
      return { error: { code: "unauthorized", message: "Missing refresh token" } };
    }
    const session = await authService.refresh(token, getClientContext(request));
    setSessionCookies(set, {
      accessToken: session.response.accessToken,
      accessExpiresIn: session.response.expiresIn,
      refreshToken: session.refreshToken,
      refreshExpiresAt: session.refreshTokenExpiresAt,
    });
    return session.response;
  })
  .post("/logout", async ({ set, request }) => {
    const token = readRefreshToken(request);
    await authService.logout(token);
    clearSessionCookies(set);
    return { ok: true };
  });
