import { loginInputSchema, registerInputSchema } from "@bomberman/types";
import { cookie } from "@elysiajs/cookie";
import { Elysia } from "elysia";

import { parseOrThrow } from "@/common/validation";
import { env } from "@/config/env";
import { rateLimit } from "@/plugins/rate-limit.plugin";

import { authService } from "../services/auth.service";

const REFRESH_COOKIE = "bc_refresh";

function refreshCookieOptions(expiresAt: Date): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "none" | "lax";
  path: string;
  maxAge: number;
  expires: Date;
  domain?: string;
} {
  const options = {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SECURE ? ("none" as const) : ("lax" as const),
    path: "/auth",
    maxAge: env.JWT_REFRESH_TTL_DAYS * 24 * 60 * 60,
    expires: expiresAt,
  };
  if (env.COOKIE_DOMAIN) {
    return { ...options, domain: env.COOKIE_DOMAIN };
  }
  return options;
}

function getClientContext(request: Request): { userAgent: string | null; ip: string | null } {
  return {
    userAgent: request.headers.get("user-agent"),
    ip:
      request.headers.get("cf-connecting-ip") ??
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      null,
  };
}

export const authController = new Elysia({ prefix: "/auth" })
  .use(cookie())
  .use(rateLimit("auth", { windowMs: 60_000, max: 30 }))
  .post("/register", async ({ body, setCookie, request }) => {
    const input = parseOrThrow(registerInputSchema, body);
    const session = await authService.register(input, getClientContext(request));
    setCookie(
      REFRESH_COOKIE,
      session.refreshToken,
      refreshCookieOptions(session.refreshTokenExpiresAt),
    );
    return session.response;
  })
  .post("/login", async ({ body, setCookie, request }) => {
    const input = parseOrThrow(loginInputSchema, body);
    const session = await authService.login(input, getClientContext(request));
    setCookie(
      REFRESH_COOKIE,
      session.refreshToken,
      refreshCookieOptions(session.refreshTokenExpiresAt),
    );
    return session.response;
  })
  .post("/refresh", async ({ cookie, setCookie, request, set }) => {
    const token = cookie[REFRESH_COOKIE];
    if (!token) {
      set.status = 401;
      return { error: { code: "unauthorized", message: "Missing refresh token" } };
    }
    const session = await authService.refresh(token, getClientContext(request));
    setCookie(
      REFRESH_COOKIE,
      session.refreshToken,
      refreshCookieOptions(session.refreshTokenExpiresAt),
    );
    return session.response;
  })
  .post("/logout", async ({ cookie, removeCookie }) => {
    const token = cookie[REFRESH_COOKIE];
    await authService.logout(token ?? null);
    removeCookie(REFRESH_COOKIE);
    return { ok: true };
  });
