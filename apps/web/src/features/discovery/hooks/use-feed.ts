"use client";

import type { FeedScope } from "@bomberman/types";
import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

export function useFeed(scope: FeedScope) {
  return useQuery({
    queryKey: queryKeys.discovery.feed(scope),
    queryFn: () => apiClient.discovery.feed(scope),
  });
}
