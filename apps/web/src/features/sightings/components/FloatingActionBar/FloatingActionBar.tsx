"use client";

import { useState } from "react";

import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/shared/utils/cn";

import { useToggleLike } from "@/features/social/hooks/use-like";

export interface FloatingActionBarProps {
  targetId: string;
  initialLiked: boolean;
  initialLikeCount: number;
  initialCommentCount: number;
  onCommentClick: () => void;
  className?: string;
}

export function FloatingActionBar({
  targetId,
  initialLiked,
  initialLikeCount,
  initialCommentCount,
  onCommentClick,
  className,
}: FloatingActionBarProps): JSX.Element {
  const [likeState, setLikeState] = useState({ liked: initialLiked, count: initialLikeCount });
  const [pulse, setPulse] = useState(false);
  const toggleLike = useToggleLike("SIGHTING", targetId);

  const handleLike = (): void => {
    setPulse(true);
    setTimeout(() => setPulse(false), 300);
    setLikeState((previous) => ({
      liked: !previous.liked,
      count: previous.count + (previous.liked ? -1 : 1),
    }));
    toggleLike.mutate(undefined, {
      onSuccess: (data) => setLikeState({ liked: data.liked, count: data.count }),
      onError: () => setLikeState({ liked: initialLiked, count: initialLikeCount }),
    });
  };

  return (
    <div className={cn("absolute bottom-4 right-3 flex flex-col items-center gap-3", className)}>
      <button
        type="button"
        aria-label="Curtir"
        aria-pressed={likeState.liked}
        className={cn(
          "flex flex-col items-center gap-0.5 rounded-full bg-black/45 px-2.5 py-2 text-white backdrop-blur transition-transform",
          pulse && "scale-110",
          likeState.liked && "text-red-400",
        )}
        onClick={handleLike}
      >
        <Icon name="heart" size="sm" />
        <span className="text-xs font-semibold">{likeState.count}</span>
      </button>
      <button
        type="button"
        aria-label="Comentários"
        className="relative flex flex-col items-center gap-0.5 rounded-full bg-black/45 px-2.5 py-2 text-white backdrop-blur"
        onClick={onCommentClick}
      >
        <Icon name="comment" size="sm" />
        <span className="text-xs font-semibold">{initialCommentCount}</span>
        {initialCommentCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500" />
        ) : null}
      </button>
    </div>
  );
}
