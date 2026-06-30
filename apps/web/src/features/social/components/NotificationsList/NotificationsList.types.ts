import type { NotificationResponse } from "@bomberman/types";

export interface NotificationsListProps {
  notifications: ReadonlyArray<NotificationResponse>;
  onRead?: (id: string) => void;
  className?: string;
}
