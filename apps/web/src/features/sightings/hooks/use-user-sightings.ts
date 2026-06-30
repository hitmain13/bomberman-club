"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

export function useUserSightings(username: string) {
  return useQuery({
    queryKey: queryKeys.sightings.byUser(username),
    queryFn: () => apiClient.sightings.listByUser(username),
    enabled: username.length > 0,
  });
}
