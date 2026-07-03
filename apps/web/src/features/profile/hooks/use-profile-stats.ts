"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

export function useProfileStats(username: string) {
  return useQuery({
    queryKey: queryKeys.users.stats(username),
    queryFn: () => apiClient.users.stats(username),
    enabled: username.length > 0,
  });
}
