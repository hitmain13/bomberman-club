"use client";

import type { TargetType } from "@bomberman/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

export function useToggleLike(targetType: TargetType, targetId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.social.toggleLike(targetType, targetId),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.social.likes(targetType, targetId), data);
    },
  });
}
