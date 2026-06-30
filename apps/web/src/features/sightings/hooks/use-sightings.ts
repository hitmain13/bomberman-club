"use client";

import type { SightingPeriod } from "@bomberman/types";
import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

export function useSightings(period: SightingPeriod) {
  return useQuery({
    queryKey: queryKeys.sightings.list(period),
    queryFn: () => apiClient.sightings.list({ period, limit: 50 }),
  });
}

export function useSighting(id: string) {
  return useQuery({
    queryKey: queryKeys.sightings.detail(id),
    queryFn: () => apiClient.sightings.get(id),
    enabled: id.length > 0,
  });
}
