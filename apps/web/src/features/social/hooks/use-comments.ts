"use client";

import type { TargetType } from "@bomberman/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

export function useComments(targetType: TargetType, targetId: string) {
  return useQuery({
    queryKey: queryKeys.social.comments(targetType, targetId),
    queryFn: () => apiClient.social.listComments(targetType, targetId),
    enabled: targetId.length > 0,
  });
}

export function useCreateComment(targetType: TargetType, targetId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) =>
      apiClient.social.createComment({ targetType, targetId, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.social.comments(targetType, targetId),
      });
    },
  });
}

export function useDeleteComment(targetType: TargetType, targetId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.social.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.social.comments(targetType, targetId),
      });
    },
  });
}
