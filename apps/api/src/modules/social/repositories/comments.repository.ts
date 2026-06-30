import type { Comment, TargetType, Upload, User } from "@prisma/client";

import { prisma } from "@/database/prisma";

export type CommentWithAuthor = Comment & {
  author: User & { avatar: Upload | null };
};

const includeAuthor = { author: { include: { avatar: true } } } as const;

export class CommentsRepository {
  listByTarget(targetType: TargetType, targetId: string): Promise<CommentWithAuthor[]> {
    return prisma.comment.findMany({
      where: { targetType, targetId },
      include: includeAuthor,
      orderBy: { createdAt: "asc" },
    });
  }

  create(data: {
    authorId: string;
    targetType: TargetType;
    targetId: string;
    content: string;
  }): Promise<CommentWithAuthor> {
    return prisma.comment.create({ data, include: includeAuthor });
  }

  findById(id: string): Promise<CommentWithAuthor | null> {
    return prisma.comment.findUnique({ where: { id }, include: includeAuthor });
  }

  remove(id: string): Promise<Comment> {
    return prisma.comment.delete({ where: { id } });
  }
}

export const commentsRepository = new CommentsRepository();
