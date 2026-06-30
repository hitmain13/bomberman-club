"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

export function useToggleFollow(username: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.social.toggleFollow(username),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.social.follow(username), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.byUsername(username) });
    },
  });
}
