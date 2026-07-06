import type { User } from "@prisma/client";

import { ForbiddenError, NotFoundError } from "@/common/errors";
import { authRepository } from "@/modules/auth/repositories/auth.repository";
import { uploadCleanupService } from "@/modules/uploads/services/upload-cleanup.service";

import { type UploadWithOwner, adminRepository } from "../repositories/admin.repository";

export interface UploadListItem {
  id: string;
  url: string;
  mime: string;
  size: number;
  createdAt: string;
  owner: { username: string; email: string };
}

export interface UserListItem {
  id: string;
  username: string;
  email: string;
  role: string;
  bannedAt: string | null;
  createdAt: string;
}

function toUploadDto(upload: UploadWithOwner): UploadListItem {
  return {
    id: upload.id,
    url: upload.url,
    mime: upload.mime,
    size: upload.size,
    createdAt:
      typeof upload.createdAt === "string" ? upload.createdAt : upload.createdAt.toISOString(),
    owner: upload.owner,
  };
}

function toUserDto(user: User): UserListItem {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    bannedAt: user.bannedAt
      ? typeof user.bannedAt === "string"
        ? user.bannedAt
        : user.bannedAt.toISOString()
      : null,
    createdAt: typeof user.createdAt === "string" ? user.createdAt : user.createdAt.toISOString(),
  };
}

export class AdminService {
  async listUploads(limit = 50, cursor?: string): Promise<UploadListItem[]> {
    const uploads = await adminRepository.listUploads(limit, cursor);
    return uploads.map(toUploadDto);
  }

  async removeUpload(id: string): Promise<void> {
    await uploadCleanupService.removeUpload(id);
  }

  async listUsers(limit = 50, cursor?: string): Promise<UserListItem[]> {
    const users = await adminRepository.listUsers(limit, cursor);
    return users.map(toUserDto);
  }

  async banUser(id: string): Promise<void> {
    const user = await adminRepository.findUserById(id);
    if (!user) {
      throw new NotFoundError("User", id);
    }
    if (user.role === "ADMIN") {
      throw new ForbiddenError("Não é possível banir administradores.");
    }
    await adminRepository.banUser(id);
    await authRepository.revokeAllRefreshTokensForUser(id);
  }

  async unbanUser(id: string): Promise<void> {
    const user = await adminRepository.findUserById(id);
    if (!user) {
      throw new NotFoundError("User", id);
    }
    await adminRepository.unbanUser(id);
  }
}

export const adminService = new AdminService();
