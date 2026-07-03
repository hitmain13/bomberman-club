"use client";

import type { PeopleSort } from "@bomberman/types";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/shared/contexts/auth-context";
import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

export interface ExplorePeopleFilters {
  query?: string | undefined;
  city?: string | undefined;
  since?: string | undefined;
  sort?: PeopleSort | undefined;
}

export function useExplorePeople(filters: ExplorePeopleFilters = {}) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.discovery.explorePeople({
      q: filters.query ?? "",
      city: filters.city ?? "",
      since: filters.since ?? "",
      sort: filters.sort ?? "RECENT",
    }),
    queryFn: () =>
      apiClient.discovery.explorePeople({
        q: filters.query,
        city: filters.city,
        since: filters.since,
        sort: filters.sort,
        limit: 30,
      }),
    enabled: isAuthenticated,
  });
}
