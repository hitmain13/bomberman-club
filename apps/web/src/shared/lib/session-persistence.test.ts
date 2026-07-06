import { afterEach, describe, expect, it } from "vitest";

import { clearUserCache, persistUserCache, readUserCache } from "./session-persistence";

const user = {
  id: "user-1",
  username: "matsu",
  email: "matsu@example.com",
  role: "USER" as const,
  avatarUrl: null,
  bio: null,
  city: null,
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("session-persistence", () => {
  afterEach(() => {
    clearUserCache();
  });

  it("persists and restores user cache without access tokens", () => {
    persistUserCache(user);
    const restored = readUserCache();
    expect(restored?.username).toBe("matsu");
    expect(restored?.id).toBe("user-1");
  });

  it("clears invalid cache payloads", () => {
    localStorage.setItem("bc_user_cache", "{");
    expect(readUserCache()).toBeNull();
    expect(localStorage.getItem("bc_user_cache")).toBeNull();
  });
});
