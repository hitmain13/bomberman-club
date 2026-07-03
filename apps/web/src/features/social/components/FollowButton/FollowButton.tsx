"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/atoms/Button";

import { useToggleFollow } from "../../hooks/use-follow";

import type { FollowButtonProps } from "./FollowButton.types";

export function FollowButton({
  username,
  initialFollowing = false,
  onToggled,
  className,
}: FollowButtonProps): JSX.Element {
  const mutation = useToggleFollow(username);
  const [following, setFollowing] = useState(initialFollowing);

  useEffect(() => {
    setFollowing(initialFollowing);
  }, [initialFollowing]);

  return (
    <Button
      fullWidth
      className={className}
      variant={following ? "secondary" : "primary"}
      isLoading={mutation.isPending}
      onClick={() =>
        mutation.mutate(undefined, {
          onSuccess: (data) => {
            setFollowing(data.following);
            onToggled?.(data.following);
          },
        })
      }
    >
      {following ? "Seguindo" : "Seguir"}
    </Button>
  );
}
