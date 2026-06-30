import { TargetTypeSchema, commentInputSchema } from "@bomberman/types";
import type { TargetType } from "@prisma/client";
import { Elysia } from "elysia";

import { parseOrThrow } from "@/common/validation";
import { authPlugin, requireAuth } from "@/plugins/auth.plugin";

import { commentsService } from "../services/comments.service";
import { favoritesService } from "../services/favorites.service";
import { followsService } from "../services/follows.service";
import { likesService } from "../services/likes.service";
import { notificationsService } from "../services/notifications.service";

function parseTargetType(raw: string): TargetType {
  return parseOrThrow(TargetTypeSchema, raw);
}

export const socialController = new Elysia({ name: "social-controller" })
  .use(authPlugin)
  .post("/likes/:targetType/:targetId/toggle", ({ currentUser, params }) => {
    const user = requireAuth(currentUser);
    return likesService.toggle(user.id, parseTargetType(params.targetType), params.targetId);
  })
  .post("/favorites/:targetType/:targetId/toggle", ({ currentUser, params }) => {
    const user = requireAuth(currentUser);
    return favoritesService.toggle(user.id, parseTargetType(params.targetType), params.targetId);
  })
  .get("/comments/:targetType/:targetId", ({ params }) =>
    commentsService.list(parseTargetType(params.targetType), params.targetId),
  )
  .post("/comments", ({ currentUser, body }) => {
    const user = requireAuth(currentUser);
    const input = parseOrThrow(commentInputSchema, body);
    return commentsService.create(user.id, input);
  })
  .delete("/comments/:id", async ({ currentUser, params }) => {
    const user = requireAuth(currentUser);
    await commentsService.remove(params.id, user.id);
    return { ok: true };
  })
  .post("/follows/:username/toggle", ({ currentUser, params }) => {
    const user = requireAuth(currentUser);
    return followsService.toggle(user.id, params.username);
  })
  .get("/notifications", ({ currentUser }) => {
    const user = requireAuth(currentUser);
    return notificationsService.list(user.id);
  })
  .post("/notifications/:id/read", async ({ currentUser, params }) => {
    const user = requireAuth(currentUser);
    await notificationsService.markAsRead(user.id, params.id);
    return { ok: true };
  });
