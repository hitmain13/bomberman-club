import type { AuthResponse, PrivateUser } from "@bomberman/types";

const SESSION_STORAGE_KEY = "bc_session";

interface PersistedSession {
  user: PrivateUser;
  accessToken: string;
  expiresAt: number;
}

export function persistSession(session: AuthResponse): void {
  if (typeof window === "undefined") {
    return;
  }
  const payload: PersistedSession = {
    user: session.user,
    accessToken: session.accessToken,
    expiresAt: Date.now() + session.expiresIn * 1000,
  };
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));
}

export function readPersistedSession(): PersistedSession | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as PersistedSession;
    if (
      !parsed.accessToken ||
      !parsed.user ||
      typeof parsed.expiresAt !== "number" ||
      parsed.expiresAt <= Date.now()
    ) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function clearPersistedSession(): void {
  if (typeof window === "undefined") {
    return;
  }
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
}
