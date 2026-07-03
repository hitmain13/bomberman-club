"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

export function useLikedItems(username: string) {
  return useQuery({
    queryKey: queryKeys.users.likes(username),
    queryFn: () => apiClient.users.likedItems(username),
    enabled: username.length > 0,
  });
}
