import {
  type CommentInput,
  type CommentResponse,
  type FollowResponse,
  type LikeResponse,
  type NotificationResponse,
  type TargetType,
  commentInputSchema,
  commentResponseSchema,
  followResponseSchema,
  likeResponseSchema,
  notificationResponseSchema,
} from "@bomberman/types";
import { z } from "zod";

import type { HttpClient } from "../http";

export class SocialResource {
  constructor(private readonly http: HttpClient) {}

  toggleLike(targetType: TargetType, targetId: string): Promise<LikeResponse> {
    return this.http.request({
      method: "POST",
      path: `/likes/${targetType}/${encodeURIComponent(targetId)}/toggle`,
      responseSchema: likeResponseSchema,
    });
  }

  toggleFavorite(targetType: TargetType, targetId: string): Promise<LikeResponse> {
    return this.http.request({
      method: "POST",
      path: `/favorites/${targetType}/${encodeURIComponent(targetId)}/toggle`,
      responseSchema: likeResponseSchema,
    });
  }

  listComments(targetType: TargetType, targetId: string): Promise<CommentResponse[]> {
    return this.http.request({
      path: `/comments/${targetType}/${encodeURIComponent(targetId)}`,
      responseSchema: z.array(commentResponseSchema),
    });
  }

  createComment(input: CommentInput): Promise<CommentResponse> {
    const body = commentInputSchema.parse(input);
    return this.http.request({
      method: "POST",
      path: "/comments",
      body,
      responseSchema: commentResponseSchema,
    });
  }

  deleteComment(id: string): Promise<{ ok: boolean }> {
    return this.http.request({
      method: "DELETE",
      path: `/comments/${encodeURIComponent(id)}`,
      responseSchema: z.object({ ok: z.boolean() }),
    });
  }

  toggleFollow(username: string): Promise<FollowResponse> {
    return this.http.request({
      method: "POST",
      path: `/follows/${encodeURIComponent(username)}/toggle`,
      responseSchema: followResponseSchema,
    });
  }

  listNotifications(): Promise<NotificationResponse[]> {
    return this.http.request({
      path: "/notifications",
      responseSchema: z.array(notificationResponseSchema),
    });
  }

  markNotificationRead(id: string): Promise<{ ok: boolean }> {
    return this.http.request({
      method: "POST",
      path: `/notifications/${encodeURIComponent(id)}/read`,
      responseSchema: z.object({ ok: z.boolean() }),
    });
  }
}
