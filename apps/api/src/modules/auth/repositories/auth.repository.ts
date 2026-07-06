import type { RefreshToken, User } from "@prisma/client";

import { prisma } from "@/database/prisma";

export class AuthRepository {
  findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  }

  findUserByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { username: username.toLowerCase() } });
  }

  findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  createUser(input: {
    username: string;
    email: string;
    passwordHash: string;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        username: input.username.toLowerCase(),
        email: input.email.toLowerCase(),
        passwordHash: input.passwordHash,
      },
    });
  }

  createRefreshToken(input: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    userAgent: string | null;
    ip: string | null;
  }): Promise<RefreshToken> {
    return prisma.refreshToken.create({
      data: {
        userId: input.userId,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
        userAgent: input.userAgent,
        ip: input.ip,
      },
    });
  }

  findActiveRefreshToken(tokenHash: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
  }

  findRecentlyRevokedRefreshToken(
    tokenHash: string,
    graceMs: number,
  ): Promise<RefreshToken | null> {
    const since = new Date(Date.now() - graceMs);
    return prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: { gte: since },
        expiresAt: { gt: new Date() },
      },
      orderBy: { revokedAt: "desc" },
    });
  }

  revokeRefreshToken(id: string): Promise<RefreshToken> {
    return prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  revokeAllRefreshTokensForUser(userId: string): Promise<{ count: number }> {
    return prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}

export const authRepository = new AuthRepository();
