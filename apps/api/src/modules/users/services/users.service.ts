import type { PrivateUser, PublicUser } from "@bomberman/types";
import type { Prisma } from "@prisma/client";

import { ConflictError, NotFoundError } from "@/common/errors";

import { toPrivateUser, toPublicUser } from "../mappers/users.mapper";
import { usersRepository } from "../repositories/users.repository";
import type { UpdateMeInput } from "../schemas/users.schema";

export class UsersService {
  async getMe(userId: string): Promise<PrivateUser> {
    const user = await usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User", userId);
    }
    const avatarUrl = await usersRepository.findAvatarUrl(user.avatarUploadId);
    return toPrivateUser(user, avatarUrl);
  }

  async getByUsername(username: string): Promise<PublicUser> {
    const user = await usersRepository.findByUsername(username);
    if (!user) {
      throw new NotFoundError("User", username);
    }
    const avatarUrl = await usersRepository.findAvatarUrl(user.avatarUploadId);
    return toPublicUser(user, avatarUrl);
  }

  async updateMe(userId: string, input: UpdateMeInput): Promise<PrivateUser> {
    const current = await usersRepository.findById(userId);
    if (!current) {
      throw new NotFoundError("User", userId);
    }

    if (input.username && input.username !== current.username) {
      const exists = await usersRepository.findByUsername(input.username);
      if (exists && exists.id !== userId) {
        throw new ConflictError("Username já está em uso.");
      }
    }

    const data: Prisma.UserUpdateInput = {};
    if (input.username) {
      data.username = input.username.toLowerCase();
    }
    if (input.bio !== undefined) {
      data.bio = input.bio;
    }
    if (input.city !== undefined) {
      data.city = input.city;
    }
    if (input.avatarUploadId !== undefined) {
      data.avatar = input.avatarUploadId
        ? { connect: { id: input.avatarUploadId } }
        : { disconnect: true };
    }

    const updated = await usersRepository.update(userId, data);
    const avatarUrl = await usersRepository.findAvatarUrl(updated.avatarUploadId);
    return toPrivateUser(updated, avatarUrl);
  }
}

export const usersService = new UsersService();
