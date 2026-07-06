import { describe, expect, it, vi } from "vitest";

import { ForbiddenError, UnauthorizedError } from "@/common/errors";

import { AuthService } from "./auth.service";

describe("AuthService ban enforcement", () => {
  const service = new AuthService();

  it("rejects login for banned users", async () => {
    vi.stubGlobal("Bun", {
      password: {
        verify: vi.fn().mockResolvedValue(true),
      },
    });

    const authRepository = await import("../repositories/auth.repository");
    vi.spyOn(authRepository.authRepository, "findUserByUsername").mockResolvedValue({
      id: "user_smoke",
      username: "smoke",
      email: "smoke@example.com",
      passwordHash: "hash",
      role: "USER",
      bannedAt: new Date(),
      bio: null,
      city: null,
      avatarUploadId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      service.login(
        { identifier: "smoke", password: "Onboard@8723" },
        { userAgent: null, ip: null },
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("rejects refresh for banned users", async () => {
    const authRepository = await import("../repositories/auth.repository");
    vi.spyOn(authRepository.authRepository, "findActiveRefreshToken").mockResolvedValue({
      id: "rt_1",
      userId: "user_smoke",
      tokenHash: "hash",
      expiresAt: new Date(Date.now() + 60_000),
      revokedAt: null,
      userAgent: null,
      ip: null,
      createdAt: new Date(),
    });
    vi.spyOn(authRepository.authRepository, "revokeRefreshToken").mockResolvedValue({} as never);
    vi.spyOn(authRepository.authRepository, "findUserById").mockResolvedValue({
      id: "user_smoke",
      username: "smoke",
      email: "smoke@example.com",
      passwordHash: "hash",
      role: "USER",
      bannedAt: new Date(),
      bio: null,
      city: null,
      avatarUploadId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(service.refresh("token", { userAgent: null, ip: null })).rejects.toBeInstanceOf(
      ForbiddenError,
    );
  });

  it("rejects refresh when session token is missing", async () => {
    const authRepository = await import("../repositories/auth.repository");
    vi.spyOn(authRepository.authRepository, "findActiveRefreshToken").mockResolvedValue(null);
    vi.spyOn(authRepository.authRepository, "findRecentlyRevokedRefreshToken").mockResolvedValue(
      null,
    );

    await expect(service.refresh("missing", { userAgent: null, ip: null })).rejects.toBeInstanceOf(
      UnauthorizedError,
    );
  });

  it("accepts recently rotated refresh tokens within grace window", async () => {
    const authRepository = await import("../repositories/auth.repository");
    vi.spyOn(authRepository.authRepository, "findActiveRefreshToken").mockResolvedValue(null);
    vi.spyOn(authRepository.authRepository, "findRecentlyRevokedRefreshToken").mockResolvedValue({
      id: "rt_old",
      userId: "user_1",
      tokenHash: "hash",
      expiresAt: new Date(Date.now() + 60_000),
      revokedAt: new Date(),
      userAgent: null,
      ip: null,
      createdAt: new Date(),
    });
    vi.spyOn(authRepository.authRepository, "findUserById").mockResolvedValue({
      id: "user_1",
      username: "matsu",
      email: "m@example.com",
      passwordHash: "hash",
      role: "USER",
      bannedAt: null,
      bio: null,
      city: null,
      avatarUploadId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.spyOn(authRepository.authRepository, "createRefreshToken").mockResolvedValue({} as never);

    const usersRepository = await import("@/modules/users/repositories/users.repository");
    vi.spyOn(usersRepository.usersRepository, "findAvatarUrl").mockResolvedValue(null);

    const session = await service.refresh("rotated-token", { userAgent: null, ip: null });
    expect(session.response.user.username).toBe("matsu");
  });
});
