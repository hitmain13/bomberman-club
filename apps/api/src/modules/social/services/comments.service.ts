import type { CommentInput, CommentResponse } from "@bomberman/types";
import type { TargetType } from "@prisma/client";

import { ForbiddenError, NotFoundError } from "@/common/errors";

import { type CommentWithAuthor, commentsRepository } from "../repositories/comments.repository";
import { notificationsRepository } from "../repositories/notifications.repository";
import { resolveTargetOwnerId } from "./target-owner.service";

function toResponse(comment: CommentWithAuthor): CommentResponse {
  return {
    id: comment.id,
    authorId: comment.authorId,
    authorUsername: comment.author.username,
    authorAvatarUrl: comment.author.avatar?.url ?? null,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
  };
}

export class CommentsService {
  async list(targetType: TargetType, targetId: string): Promise<CommentResponse[]> {
    const items = await commentsRepository.listByTarget(targetType, targetId);
    return items.map(toResponse);
  }

  async create(userId: string, input: CommentInput): Promise<CommentResponse> {
    const created = await commentsRepository.create({
      authorId: userId,
      targetType: input.targetType,
      targetId: input.targetId,
      content: input.content,
    });
    const ownerId = await resolveTargetOwnerId(input.targetType, input.targetId);
    if (ownerId !== userId) {
      await notificationsRepository.create({
        userId: ownerId,
        type: "COMMENT",
        actorId: userId,
        targetType: input.targetType,
        targetId: input.targetId,
      });
    }
    return toResponse(created);
  }

  async remove(id: string, userId: string): Promise<void> {
    const existing = await commentsRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Comment", id);
    }
    if (existing.authorId !== userId) {
      throw new ForbiddenError("Você não pode remover este comentário.");
    }
    await commentsRepository.remove(id);
  }
}

export const commentsService = new CommentsService();
