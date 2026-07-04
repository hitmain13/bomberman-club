import { loginInputSchema, registerInputSchema } from "@bomberman/types";
import { parse, serialize } from "cookie";
import { Elysia } from "elysia";

import { parseOrThrow } from "@/common/validation";
import { env } from "@/config/env";
import { rateLimit } from "@/plugins/rate-limit.plugin";

import { authService } from "../services/auth.service";

const REFRESH_COOKIE = "bc_refresh";

type SetHeaders = {
  headers: Record<string, string | number | string[] | undefined>;
};

function usesSecureCookies(): boolean {
  return env.COOKIE_SECURE || env.NODE_ENV === "production";
}

function resolveCookieDomain(): string | undefined {
  if (!env.COOKIE_DOMAIN) {
    return undefined;
  }
  try {
    const webHost = new URL(env.WEB_ORIGIN).hostname;
    const apiHost = new URL(env.API_BASE_URL).hostname;
    if (webHost !== apiHost) {
      return undefined;
    }
  } catch {
    return undefined;
  }
  return env.COOKIE_DOMAIN;
}

function refreshCookieOptions(expiresAt: Date): Parameters<typeof serialize>[2] {
  const secure = usesSecureCookies();
  const options: Parameters<typeof serialize>[2] = {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    path: "/",
    maxAge: env.JWT_REFRESH_TTL_DAYS * 24 * 60 * 60,
    expires: expiresAt,
  };
  const domain = resolveCookieDomain();
  if (domain) {
    options.domain = domain;
  }
  return options;
}

function appendSetCookie(set: SetHeaders, value: string): void {
  const current = set.headers["Set-Cookie"];
  if (Array.isArray(current)) {
    set.headers["Set-Cookie"] = [...current, value];
    return;
  }
  if (typeof current === "string") {
    set.headers["Set-Cookie"] = [current, value];
    return;
  }
  set.headers["Set-Cookie"] = value;
}

function setRefreshCookie(set: SetHeaders, token: string, expiresAt: Date): void {
  const secure = usesSecureCookies();
  const legacyClear: Parameters<typeof serialize>[2] = {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    path: "/auth",
    expires: new Date(0),
    maxAge: 0,
  };
  const domain = resolveCookieDomain();
  if (domain) {
    legacyClear.domain = domain;
  }
  appendSetCookie(set, serialize(REFRESH_COOKIE, "", legacyClear));
  appendSetCookie(set, serialize(REFRESH_COOKIE, token, refreshCookieOptions(expiresAt)));
}

function clearRefreshCookie(set: SetHeaders): void {
  const secure = usesSecureCookies();
  const options: Parameters<typeof serialize>[2] = {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  };
  const domain = resolveCookieDomain();
  if (domain) {
    options.domain = domain;
  }
  appendSetCookie(set, serialize(REFRESH_COOKIE, "", options));
}

function readRefreshToken(request: Request): string | null {
  const header = request.headers.get("cookie");
  if (!header) {
    return null;
  }
  return parse(header)[REFRESH_COOKIE] ?? null;
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
  .post("/register", async ({ body, set, request }) => {
    const input = parseOrThrow(registerInputSchema, body);
    const session = await authService.register(input, getClientContext(request));
    setRefreshCookie(set, session.refreshToken, session.refreshTokenExpiresAt);
    return session.response;
  })
  .post("/login", async ({ body, set, request }) => {
    const input = parseOrThrow(loginInputSchema, body);
    const session = await authService.login(input, getClientContext(request));
    setRefreshCookie(set, session.refreshToken, session.refreshTokenExpiresAt);
    return session.response;
  })
  .post("/refresh", async ({ set, request }) => {
    const token = readRefreshToken(request);
    if (!token) {
      set.status = 401;
      return { error: { code: "unauthorized", message: "Missing refresh token" } };
    }
    const session = await authService.refresh(token, getClientContext(request));
    setRefreshCookie(set, session.refreshToken, session.refreshTokenExpiresAt);
    return session.response;
  })
  .post("/logout", async ({ set, request }) => {
    const token = readRefreshToken(request);
    await authService.logout(token);
    clearRefreshCookie(set);
    return { ok: true };
  });
