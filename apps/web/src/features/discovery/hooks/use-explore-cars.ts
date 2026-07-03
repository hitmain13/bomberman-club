"use client";

import type { CarsSort } from "@bomberman/types";
import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

export interface ExploreCarsFilters {
  query?: string | undefined;
  stage?: string | undefined;
  owner?: string | undefined;
  sort?: CarsSort | undefined;
}

export function useExploreCars(filters: ExploreCarsFilters = {}) {
  return useQuery({
    queryKey: queryKeys.discovery.exploreCars({
      q: filters.query ?? "",
      stage: filters.stage ?? "",
      owner: filters.owner ?? "",
      sort: filters.sort ?? "NEWEST",
    }),
    queryFn: () =>
      apiClient.discovery.exploreCars({
        q: filters.query,
        stage: filters.stage,
        owner: filters.owner,
        sort: filters.sort,
        limit: 30,
      }),
  });
}
