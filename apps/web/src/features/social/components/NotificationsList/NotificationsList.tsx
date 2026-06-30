"use client";

import type { NotificationResponse, NotificationType } from "@bomberman/types";

import { Avatar } from "@/components/atoms/Avatar";
import { formatRelative } from "@/features/sightings";
import { cn } from "@/shared/utils/cn";

import { styles } from "./NotificationsList.styles";
import type { NotificationsListProps } from "./NotificationsList.types";

const VERB: Record<NotificationType, string> = {
  FOLLOW: "começou a seguir você",
  LIKE: "curtiu seu conteúdo",
  COMMENT: "comentou no seu conteúdo",
  MENTION: "mencionou você",
  SIGHTING_NEW: "publicou um novo flagrado",
};

function describe(notification: NotificationResponse): string {
  const actor = notification.actorUsername ? `@${notification.actorUsername} ` : "Alguém ";
  return `${actor}${VERB[notification.type]}`;
}

export function NotificationsList({
  notifications,
  onRead,
  className,
}: NotificationsListProps): JSX.Element {
  return (
    <ul className={cn(styles.root, className)}>
      {notifications.map((notification) => {
        const unread = notification.readAt === null;
        return (
          <li
            key={notification.id}
            className={cn(styles.item, unread && styles.itemUnread)}
            onClick={() => {
              if (unread && onRead) {
                onRead(notification.id);
              }
            }}
            onKeyDown={(event) => {
              if ((event.key === "Enter" || event.key === " ") && unread && onRead) {
                event.preventDefault();
                onRead(notification.id);
              }
            }}
            aria-pressed={unread ? "false" : undefined}
            role={onRead ? "button" : "listitem"}
            tabIndex={onRead ? 0 : -1}
          >
            <Avatar
              src={notification.actorAvatarUrl}
              alt={notification.actorUsername ?? "Sistema"}
              size="sm"
            />
            <div className={styles.text}>
              <p>{describe(notification)}</p>
              <p className={styles.meta}>{formatRelative(notification.createdAt)}</p>
            </div>
            {unread ? <span className={styles.dot} aria-label="não lida" /> : null}
          </li>
        );
      })}
    </ul>
  );
}
