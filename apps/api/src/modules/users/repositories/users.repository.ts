import type { Prisma, User } from "@prisma/client";

import { prisma } from "@/database/prisma";

export class UsersRepository {
  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { username: username.toLowerCase() } });
  }

  update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  findAvatarUrl(uploadId: string | null): Promise<string | null> {
    if (!uploadId) {
      return Promise.resolve(null);
    }
    return prisma.upload
      .findUnique({ where: { id: uploadId }, select: { url: true } })
      .then((upload) => upload?.url ?? null);
  }
}

export const usersRepository = new UsersRepository();
