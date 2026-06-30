"use client";

import { useState } from "react";

import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/shared/utils/cn";

import { useToggleLike } from "../../hooks/use-like";

import { styles } from "./LikeButton.styles";
import type { LikeButtonProps } from "./LikeButton.types";

export function LikeButton({
  targetType,
  targetId,
  initialCount = 0,
  className,
}: LikeButtonProps): JSX.Element {
  const [optimistic, setOptimistic] = useState<{ liked: boolean; count: number }>({
    liked: false,
    count: initialCount,
  });
  const mutation = useToggleLike(targetType, targetId);

  const handleClick = (): void => {
    setOptimistic((previous) => ({
      liked: !previous.liked,
      count: previous.count + (previous.liked ? -1 : 1),
    }));
    mutation.mutate(undefined, {
      onSuccess: (data) => {
        setOptimistic({ liked: data.liked, count: data.count });
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={optimistic.liked}
      className={cn(styles.root, optimistic.liked && styles.active, className)}
    >
      <Icon name="heart" size="sm" />
      <span className={styles.count}>{optimistic.count}</span>
    </button>
  );
}
