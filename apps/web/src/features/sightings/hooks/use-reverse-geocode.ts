"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

export function useReverseGeocode(latitude: number | null, longitude: number | null) {
  return useQuery({
    queryKey: queryKeys.geo.reverse(latitude ?? 0, longitude ?? 0),
    queryFn: () => apiClient.geo.reverse(latitude as number, longitude as number),
    enabled: latitude !== null && longitude !== null && !(latitude === 0 && longitude === 0),
    staleTime: 60 * 60 * 1000,
  });
}
