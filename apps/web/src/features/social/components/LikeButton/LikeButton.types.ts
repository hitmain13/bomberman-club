import type { TargetType } from "@bomberman/types";

export interface LikeButtonProps {
  targetType: TargetType;
  targetId: string;
  initialCount?: number;
  className?: string;
}
