"use client";

import type { RankingMetric } from "@bomberman/types";
import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

export function useRanking(metric: RankingMetric) {
  return useQuery({
    queryKey: queryKeys.discovery.ranking(metric),
    queryFn: () => apiClient.discovery.ranking(metric),
  });
}
