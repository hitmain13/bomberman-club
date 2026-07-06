import type { AuthResponse, PrivateUser } from "@bomberman/types";

const USER_CACHE_KEY = "bc_user_cache";

interface CachedUser {
  user: PrivateUser;
  cachedAt: number;
}

export function persistUserCache(user: PrivateUser): void {
  if (typeof window === "undefined") {
    return;
  }
  const payload: CachedUser = { user, cachedAt: Date.now() };
  localStorage.setItem(USER_CACHE_KEY, JSON.stringify(payload));
}

export function readUserCache(): PrivateUser | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as CachedUser;
    if (!parsed.user?.id) {
      localStorage.removeItem(USER_CACHE_KEY);
      return null;
    }
    return parsed.user;
  } catch {
    localStorage.removeItem(USER_CACHE_KEY);
    return null;
  }
}

export function clearUserCache(): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(USER_CACHE_KEY);
}

/** @deprecated Tokens live in HttpOnly cookies; kept for backward-compatible imports. */
export function persistSession(session: AuthResponse): void {
  persistUserCache(session.user);
}

/** @deprecated Use cookie session instead of sessionStorage tokens. */
export function readPersistedSession(): null {
  return null;
}

/** @deprecated Use readUserCache instead. */
export function readPersistedUserSnapshot(): Pick<AuthResponse, "user" | "accessToken"> | null {
  const user = readUserCache();
  if (!user) {
    return null;
  }
  return { user, accessToken: "" };
}

/** @deprecated */
export function clearPersistedSession(): void {
  clearUserCache();
}
