"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: queryKeys.users.byUsername(username),
    queryFn: () => apiClient.users.byUsername(username),
    enabled: username.length > 0,
  });
}
