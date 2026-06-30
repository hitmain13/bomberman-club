import { loginInputSchema, registerInputSchema } from "@bomberman/types";
import { Elysia } from "elysia";

import { parseOrThrow } from "@/common/validation";
import { env } from "@/config/env";
import { rateLimit } from "@/plugins/rate-limit.plugin";

import { authService } from "../services/auth.service";

const REFRESH_COOKIE = "bc_refresh";

interface CookieJar {
  [key: string]: {
    value: string | undefined;
    set(value: Record<string, unknown>): void;
    remove(): void;
  };
}

function refreshCookieOptions(expiresAt: Date): Record<string, unknown> {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: "lax",
    domain: env.COOKIE_DOMAIN,
    path: "/auth",
    expires: expiresAt,
  };
}

function setRefreshCookie(cookie: CookieJar, token: string, expiresAt: Date): void {
  const handle = cookie[REFRESH_COOKIE];
  if (!handle) {
    return;
  }
  handle.set({ value: token, ...refreshCookieOptions(expiresAt) });
}

function clearRefreshCookie(cookie: CookieJar): void {
  const handle = cookie[REFRESH_COOKIE];
  if (!handle) {
    return;
  }
  handle.remove();
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
  .use(rateLimit("auth", { windowMs: 60_000, max: 30 }))
  .post("/register", async ({ body, cookie, request }) => {
    const input = parseOrThrow(registerInputSchema, body);
    const session = await authService.register(input, getClientContext(request));
    setRefreshCookie(cookie as CookieJar, session.refreshToken, session.refreshTokenExpiresAt);
    return session.response;
  })
  .post("/login", async ({ body, cookie, request }) => {
    const input = parseOrThrow(loginInputSchema, body);
    const session = await authService.login(input, getClientContext(request));
    setRefreshCookie(cookie as CookieJar, session.refreshToken, session.refreshTokenExpiresAt);
    return session.response;
  })
  .post("/refresh", async ({ cookie, request }) => {
    const token = (cookie as CookieJar)[REFRESH_COOKIE]?.value ?? null;
    if (!token) {
      return { error: { code: "unauthorized", message: "Missing refresh token" } };
    }
    const session = await authService.refresh(token, getClientContext(request));
    setRefreshCookie(cookie as CookieJar, session.refreshToken, session.refreshTokenExpiresAt);
    return session.response;
  })
  .post("/logout", async ({ cookie }) => {
    const token = (cookie as CookieJar)[REFRESH_COOKIE]?.value ?? null;
    await authService.logout(token);
    clearRefreshCookie(cookie as CookieJar);
    return { ok: true };
  });
