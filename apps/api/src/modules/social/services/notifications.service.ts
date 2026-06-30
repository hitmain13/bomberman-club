import type { NotificationResponse } from "@bomberman/types";

import {
  type NotificationWithActor,
  notificationsRepository,
} from "../repositories/notifications.repository";

function toResponse(notification: NotificationWithActor): NotificationResponse {
  return {
    id: notification.id,
    type: notification.type,
    actorId: notification.actorId,
    actorUsername: notification.actor?.username ?? null,
    actorAvatarUrl: notification.actor?.avatar?.url ?? null,
    targetType: notification.targetType,
    targetId: notification.targetId,
    readAt: notification.readAt?.toISOString() ?? null,
    createdAt: notification.createdAt.toISOString(),
  };
}

export class NotificationsService {
  async list(userId: string): Promise<NotificationResponse[]> {
    const rows = await notificationsRepository.listForUser(userId);
    return rows.map(toResponse);
  }

  async markAsRead(userId: string, id: string): Promise<void> {
    await notificationsRepository.markAsRead(id, userId);
  }
}

export const notificationsService = new NotificationsService();
