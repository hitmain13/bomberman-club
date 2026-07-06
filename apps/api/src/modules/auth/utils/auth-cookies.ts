import { parse, serialize } from "cookie";

import { env } from "@/config/env";

export const REFRESH_COOKIE = "bc_refresh";
export const ACCESS_COOKIE = "bc_access";

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

function cookieSameSite(): "lax" | "none" {
  if (!usesSecureCookies()) {
    return "lax";
  }
  try {
    const webOrigin = new URL(env.WEB_ORIGIN).origin;
    const apiOrigin = new URL(env.API_BASE_URL).origin;
    if (webOrigin !== apiOrigin) {
      return "none";
    }
  } catch {
    return "lax";
  }
  return "lax";
}

function baseCookieOptions(): Parameters<typeof serialize>[2] {
  const secure = usesSecureCookies();
  const options: Parameters<typeof serialize>[2] = {
    httpOnly: true,
    secure,
    sameSite: cookieSameSite(),
    path: "/",
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

export function setRefreshCookie(set: SetHeaders, token: string, expiresAt: Date): void {
  const legacyClear: Parameters<typeof serialize>[2] = {
    ...baseCookieOptions(),
    path: "/auth",
    expires: new Date(0),
    maxAge: 0,
  };
  appendSetCookie(set, serialize(REFRESH_COOKIE, "", legacyClear));
  appendSetCookie(
    set,
    serialize(REFRESH_COOKIE, token, {
      ...baseCookieOptions(),
      maxAge: env.JWT_REFRESH_TTL_DAYS * 24 * 60 * 60,
      expires: expiresAt,
    }),
  );
}

export function setAccessCookie(set: SetHeaders, token: string, expiresInSeconds: number): void {
  appendSetCookie(
    set,
    serialize(ACCESS_COOKIE, token, {
      ...baseCookieOptions(),
      maxAge: expiresInSeconds,
    }),
  );
}

export function setSessionCookies(
  set: SetHeaders,
  input: {
    accessToken: string;
    accessExpiresIn: number;
    refreshToken: string;
    refreshExpiresAt: Date;
  },
): void {
  setAccessCookie(set, input.accessToken, input.accessExpiresIn);
  setRefreshCookie(set, input.refreshToken, input.refreshExpiresAt);
}

export function clearSessionCookies(set: SetHeaders): void {
  const options: Parameters<typeof serialize>[2] = {
    ...baseCookieOptions(),
    expires: new Date(0),
    maxAge: 0,
  };
  appendSetCookie(set, serialize(ACCESS_COOKIE, "", options));
  appendSetCookie(set, serialize(REFRESH_COOKIE, "", options));
}

export function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie");
  if (!header) {
    return null;
  }
  return parse(header)[name] ?? null;
}

export function readRefreshToken(request: Request): string | null {
  return readCookie(request, REFRESH_COOKIE);
}

export function readAccessToken(request: Request): string | null {
  return readCookie(request, ACCESS_COOKIE);
}
