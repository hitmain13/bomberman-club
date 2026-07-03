import { prisma } from "@/database/prisma";

import type { Upload, User } from "@prisma/client";

export interface UploadWithOwner extends Upload {
  owner: { username: string; email: string };
}

export class AdminRepository {
  async listUploads(limit = 50, cursor?: string): Promise<UploadWithOwner[]> {
    const query: Parameters<typeof prisma.upload.findMany>[0] = {
      take: limit,
      skip: cursor ? 1 : 0,
      orderBy: { createdAt: "desc" },
      include: { owner: { select: { username: true, email: true } } },
    };
    if (cursor) {
      query.cursor = { id: cursor };
    }
    return prisma.upload.findMany(query) as Promise<UploadWithOwner[]>;
  }

  async findUploadById(id: string): Promise<Upload | null> {
    return prisma.upload.findUnique({ where: { id } });
  }

  async deleteUpload(id: string): Promise<void> {
    await prisma.upload.delete({ where: { id } });
  }

  async listUsers(limit = 50, cursor?: string): Promise<User[]> {
    const query: Parameters<typeof prisma.user.findMany>[0] = {
      take: limit,
      skip: cursor ? 1 : 0,
      orderBy: { createdAt: "desc" },
    };
    if (cursor) {
      query.cursor = { id: cursor };
    }
    return prisma.user.findMany(query);
  }

  async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async banUser(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { bannedAt: new Date() },
    });
  }

  async unbanUser(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { bannedAt: null },
    });
  }
}

export const adminRepository = new AdminRepository();
