import type { TargetType } from "@bomberman/types";

export interface CommentsThreadProps {
  targetType: TargetType;
  targetId: string;
  currentUserId: string | null;
  className?: string;
}
