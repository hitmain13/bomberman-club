import { afterEach, describe, expect, it } from "vitest";

import { clearPersistedSession, persistSession, readPersistedSession } from "./session-persistence";

const session = {
  user: {
    id: "user-1",
    username: "matsu",
    email: "matsu@example.com",
    role: "USER" as const,
    avatarUrl: null,
    bio: null,
    city: null,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  accessToken: "access-token",
  expiresIn: 900,
};

describe("session-persistence", () => {
  afterEach(() => {
    clearPersistedSession();
  });

  it("persists and restores a valid session", () => {
    persistSession(session);
    const restored = readPersistedSession();
    expect(restored?.accessToken).toBe("access-token");
    expect(restored?.user.username).toBe("matsu");
  });

  it("clears expired sessions", () => {
    persistSession(session);
    const raw = sessionStorage.getItem("bc_session");
    expect(raw).not.toBeNull();
    if (!raw) {
      return;
    }
    const parsed = JSON.parse(raw) as { expiresAt: number };
    parsed.expiresAt = Date.now() - 1;
    sessionStorage.setItem("bc_session", JSON.stringify(parsed));

    expect(readPersistedSession()).toBeNull();
  });
});
