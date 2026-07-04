import { beforeEach, describe, expect, it, vi } from "vitest";

import { ForbiddenError, NotFoundError } from "@/common/errors";

import { adminRepository } from "../repositories/admin.repository";
import { AdminService } from "./admin.service";

vi.mock("../repositories/admin.repository", () => ({
  adminRepository: {
    findUploadById: vi.fn(),
    deleteUpload: vi.fn(),
    findUserById: vi.fn(),
    banUser: vi.fn(),
    unbanUser: vi.fn(),
  },
}));

vi.mock("@/modules/auth/repositories/auth.repository", () => ({
  authRepository: {
    revokeAllRefreshTokensForUser: vi.fn(),
  },
}));

vi.mock("@/modules/uploads/utils/s3", () => ({
  deleteObject: vi.fn(),
}));

describe("AdminService", () => {
  const service = new AdminService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("removeUpload", () => {
    it("removes database record before deleting object storage", async () => {
      const order: string[] = [];
      vi.mocked(adminRepository.findUploadById).mockResolvedValue({
        id: "upload_1",
        bucketKey: "u/user/photo.jpg",
      } as never);
      vi.mocked(adminRepository.deleteUpload).mockImplementation(async () => {
        order.push("db");
      });
      const { deleteObject } = await import("@/modules/uploads/utils/s3");
      vi.mocked(deleteObject).mockImplementation(async () => {
        order.push("s3");
      });

      await service.removeUpload("upload_1");

      expect(order).toEqual(["db", "s3"]);
      expect(adminRepository.deleteUpload).toHaveBeenCalledWith("upload_1");
      expect(deleteObject).toHaveBeenCalledWith("u/user/photo.jpg");
    });

    it("throws when upload does not exist", async () => {
      vi.mocked(adminRepository.findUploadById).mockResolvedValue(null);

      await expect(service.removeUpload("missing")).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("banUser", () => {
    it("bans regular users and revokes refresh tokens", async () => {
      const { authRepository } = await import("@/modules/auth/repositories/auth.repository");
      vi.mocked(adminRepository.findUserById).mockResolvedValue({
        id: "user_smoke",
        username: "smoke",
        role: "USER",
      } as never);

      await service.banUser("user_smoke");

      expect(adminRepository.banUser).toHaveBeenCalledWith("user_smoke");
      expect(authRepository.revokeAllRefreshTokensForUser).toHaveBeenCalledWith("user_smoke");
    });

    it("blocks banning administrators", async () => {
      vi.mocked(adminRepository.findUserById).mockResolvedValue({
        id: "admin_1",
        username: "hitmain13",
        role: "ADMIN",
      } as never);

      await expect(service.banUser("admin_1")).rejects.toBeInstanceOf(ForbiddenError);
      expect(adminRepository.banUser).not.toHaveBeenCalled();
    });
  });
});
