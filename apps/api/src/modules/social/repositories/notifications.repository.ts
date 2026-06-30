import type { Notification, NotificationType, TargetType, Upload, User } from "@prisma/client";

import { prisma } from "@/database/prisma";

export type NotificationWithActor = Notification & {
  actor: (User & { avatar: Upload | null }) | null;
};

const includeActor = { actor: { include: { avatar: true } } } as const;

export class NotificationsRepository {
  listForUser(userId: string): Promise<NotificationWithActor[]> {
    return prisma.notification.findMany({
      where: { userId },
      include: includeActor,
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  create(data: {
    userId: string;
    type: NotificationType;
    actorId: string | null;
    targetType: TargetType | null;
    targetId: string | null;
  }): Promise<Notification> {
    return prisma.notification.create({ data });
  }

  markAsRead(id: string, userId: string): Promise<number> {
    return prisma.notification
      .updateMany({
        where: { id, userId, readAt: null },
        data: { readAt: new Date() },
      })
      .then((result) => result.count);
  }
}

export const notificationsRepository = new NotificationsRepository();
