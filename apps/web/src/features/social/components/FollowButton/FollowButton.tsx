"use client";

import { useState } from "react";

import { Button } from "@/components/atoms/Button";

import { useToggleFollow } from "../../hooks/use-follow";

import type { FollowButtonProps } from "./FollowButton.types";

export function FollowButton({ username, className }: FollowButtonProps): JSX.Element {
  const mutation = useToggleFollow(username);
  const [following, setFollowing] = useState(false);

  return (
    <Button
      fullWidth
      className={className}
      variant={following ? "secondary" : "primary"}
      isLoading={mutation.isPending}
      onClick={() =>
        mutation.mutate(undefined, {
          onSuccess: (data) => setFollowing(data.following),
        })
      }
    >
      {following ? "Seguindo" : "Seguir"}
    </Button>
  );
}
