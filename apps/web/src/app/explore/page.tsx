"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useMemo, useState } from "react";

import type { SearchType } from "@bomberman/types";

import { Avatar } from "@/components/atoms/Avatar";
import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";
import { Input } from "@/components/atoms/Input";
import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import {
  CarsFiltersSheet,
  type CarsFiltersValue,
  FeaturedPeopleRail,
  PeopleFiltersSheet,
  type PeopleFiltersValue,
  PersonListItem,
  memberSinceToIso,
  useExploreCars,
  useExplorePeople,
  useSearch,
} from "@/features/discovery";
import { CarCard } from "@/features/garage";
import { SightingCard, useSightings } from "@/features/sightings";
import { RequireAuth } from "@/shared/contexts/require-auth";
import { cn } from "@/shared/utils/cn";

const TYPES: ReadonlyArray<{ value: SearchType; label: string }> = [
  { value: "ALL", label: "Tudo" },
  { value: "PEOPLE", label: "Pessoas" },
  { value: "CARS", label: "Carros" },
  { value: "SIGHTINGS", label: "Flagrados" },
];

const SEARCH_TYPES = new Set<SearchType>(["ALL", "PEOPLE", "CARS", "SIGHTINGS"]);

const DEFAULT_PEOPLE_FILTERS: PeopleFiltersValue = { city: "", sort: "RECENT", memberSince: "ALL" };
const DEFAULT_CARS_FILTERS: CarsFiltersValue = { stage: "", sort: "NEWEST" };

function parseSearchType(value: string | null): SearchType {
  if (value && SEARCH_TYPES.has(value as SearchType)) {
    return value as SearchType;
  }
  return "ALL";
}

function parsePeopleFilters(searchParams: URLSearchParams): PeopleFiltersValue {
  const sort = searchParams.get("sort");
  const memberSince = searchParams.get("memberSince");
  return {
    city: searchParams.get("city") ?? "",
    sort: sort === "FOLLOWERS" || sort === "RECENT" ? sort : "RECENT",
    memberSince:
      memberSince === "LAST_30_DAYS" || memberSince === "THIS_YEAR" ? memberSince : "ALL",
  };
}

function parseCarsFilters(searchParams: URLSearchParams): CarsFiltersValue {
  const sort = searchParams.get("sort");
  return {
    stage: searchParams.get("stage") ?? "",
    sort: sort === "NEWEST" || sort === "MOST_POWERFUL" || sort === "LIGHTEST" ? sort : "NEWEST",
  };
}

function SearchResults({ query, type }: { query: string; type: SearchType }): JSX.Element {
  const { data, isLoading, error } = useSearch(query, type);

  if (isLoading) {
    return <StatePanel kind="loading" />;
  }
  if (error) {
    return <StatePanel kind="error" />;
  }
  if (
    !data ||
    (data.people.length === 0 && data.cars.length === 0 && data.sightings.length === 0)
  ) {
    return <StatePanel kind="empty" title="Nada encontrado" description="Tente outro termo." />;
  }

  return (
    <div className="flex flex-col gap-6">
      {data.people.length > 0 ? (
        <section className="flex flex-col gap-2">
          <h2 className="text-xs uppercase tracking-wider text-fg-muted">Pessoas</h2>
          <ul className="flex flex-col gap-2">
            {data.people.map((user) => (
              <li key={user.id}>
                <Link
                  href={`/u/${user.username}`}
                  className="flex items-center gap-3 rounded-md border border-border-subtle bg-bg-surface px-4 py-3"
                >
                  <Avatar src={user.avatarUrl} alt={user.username} size="sm" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-fg-primary">@{user.username}</span>
                    {user.city ? <span className="text-xs text-fg-muted">{user.city}</span> : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {data.cars.length > 0 ? (
        <section className="flex flex-col gap-2">
          <h2 className="text-xs uppercase tracking-wider text-fg-muted">Carros</h2>
          <ul className="flex flex-col gap-3">
            {data.cars.map((car) => (
              <li key={car.id}>
                <CarCard car={car} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {data.sightings.length > 0 ? (
        <section className="flex flex-col gap-2">
          <h2 className="text-xs uppercase tracking-wider text-fg-muted">Flagrados</h2>
          <ul className="flex flex-col gap-3">
            {data.sightings.map((sighting) => (
              <li key={sighting.id}>
                <SightingCard sighting={sighting} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function BrowseAll({ onSeePeople }: { onSeePeople: () => void }): JSX.Element {
  const { data, isLoading, error } = useExplorePeople({ sort: "FOLLOWERS" });

  if (isLoading) {
    return <StatePanel kind="loading" />;
  }
  if (error || !data) {
    return <StatePanel kind="error" />;
  }
  if (data.items.length === 0) {
    return <StatePanel kind="empty" title="Ainda não há membros para mostrar." />;
  }

  const featured = data.items.slice(0, 6);
  const recent = data.items.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <FeaturedPeopleRail people={featured} />
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-wider text-fg-muted">Membros recentes</h2>
          <button
            type="button"
            onClick={onSeePeople}
            className="text-xs font-medium text-fg-secondary"
          >
            Ver todos
          </button>
        </div>
        <ul className="flex flex-col gap-2">
          {recent.map((person) => (
            <PersonListItem key={person.id} person={person} />
          ))}
        </ul>
      </section>
    </div>
  );
}

function BrowsePeople({
  filters,
  onFiltersChange,
}: {
  filters: PeopleFiltersValue;
  onFiltersChange: (filters: PeopleFiltersValue) => void;
}): JSX.Element {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { data, isLoading, error } = useExplorePeople({
    city: filters.city || undefined,
    sort: filters.sort,
    since: memberSinceToIso(filters.memberSince),
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        {filters.city ? (
          <Badge variant="primary">
            {filters.city}
            <button
              type="button"
              aria-label="Remover filtro de cidade"
              onClick={() => onFiltersChange({ ...filters, city: "" })}
              className="ml-1"
            >
              <Icon name="x" size="sm" />
            </button>
          </Badge>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="flex items-center gap-1 text-sm text-fg-secondary"
        >
          <Icon name="filter" size="sm" />
          Filtros
        </button>
      </div>
      {isLoading ? (
        <StatePanel kind="loading" />
      ) : error || !data ? (
        <StatePanel kind="error" />
      ) : data.items.length === 0 ? (
        <StatePanel kind="empty" title="Nenhum membro encontrado." />
      ) : (
        <ul className="flex flex-col gap-2">
          {data.items.map((person) => (
            <PersonListItem key={person.id} person={person} />
          ))}
        </ul>
      )}
      <PeopleFiltersSheet
        open={sheetOpen}
        value={filters}
        onClose={() => setSheetOpen(false)}
        onApply={onFiltersChange}
        onClear={() => onFiltersChange(DEFAULT_PEOPLE_FILTERS)}
      />
    </div>
  );
}

function BrowseCars({
  filters,
  onFiltersChange,
  ownerFilter,
  onClearOwner,
}: {
  filters: CarsFiltersValue;
  onFiltersChange: (filters: CarsFiltersValue) => void;
  ownerFilter: string | null;
  onClearOwner: () => void;
}): JSX.Element {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { data, isLoading, error } = useExploreCars({
    stage: filters.stage || undefined,
    sort: filters.sort,
    owner: ownerFilter ?? undefined,
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        {ownerFilter ? (
          <Badge variant="primary">
            Membro: @{ownerFilter}
            <button
              type="button"
              aria-label="Remover filtro de membro"
              onClick={onClearOwner}
              className="ml-1"
            >
              <Icon name="x" size="sm" />
            </button>
          </Badge>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="flex items-center gap-1 text-sm text-fg-secondary"
        >
          <Icon name="filter" size="sm" />
          Filtros
        </button>
      </div>
      {isLoading ? (
        <StatePanel kind="loading" />
      ) : error || !data ? (
        <StatePanel kind="error" />
      ) : data.items.length === 0 ? (
        <StatePanel kind="empty" title="Nenhum carro encontrado." />
      ) : (
        <ul className="flex flex-col gap-3">
          {data.items.map((entry) => (
            <li key={entry.car.id}>
              <CarCard car={entry.car} owner={entry.owner} />
            </li>
          ))}
        </ul>
      )}
      <CarsFiltersSheet
        open={sheetOpen}
        value={filters}
        onClose={() => setSheetOpen(false)}
        onApply={onFiltersChange}
        onClear={() => onFiltersChange(DEFAULT_CARS_FILTERS)}
      />
    </div>
  );
}

function BrowseSightings(): JSX.Element {
  const { data, isLoading, error } = useSightings("ALL");

  if (isLoading) {
    return <StatePanel kind="loading" />;
  }
  if (error || !data) {
    return <StatePanel kind="error" />;
  }
  if (data.items.length === 0) {
    return <StatePanel kind="empty" title="Nenhum flagrado ainda." />;
  }
  return (
    <ul className="flex flex-col gap-4">
      {data.items.map((sighting) => (
        <li key={sighting.id}>
          <SightingCard sighting={sighting} />
        </li>
      ))}
    </ul>
  );
}

function Content(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = parseSearchType(searchParams.get("type"));
  const query = searchParams.get("q") ?? "";
  const ownerFilter = searchParams.get("owner");
  const peopleFilters = useMemo(() => parsePeopleFilters(searchParams), [searchParams]);
  const carsFilters = useMemo(() => parseCarsFilters(searchParams), [searchParams]);

  const replaceParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const next = params.toString();
      router.replace(next ? `/explore?${next}` : "/explore");
    },
    [router, searchParams],
  );

  const setType = (nextType: SearchType) => {
    replaceParams((params) => {
      params.set("type", nextType);
      params.delete("q");
      if (nextType !== "PEOPLE") {
        params.delete("city");
        params.delete("memberSince");
        if (nextType !== "ALL") {
          params.delete("sort");
        }
      }
      if (nextType !== "CARS") {
        params.delete("owner");
        params.delete("stage");
        if (nextType !== "ALL" && nextType !== "PEOPLE") {
          params.delete("sort");
        }
      }
      if (nextType === "ALL") {
        params.delete("sort");
      }
    });
  };

  const setQuery = (value: string) => {
    replaceParams((params) => {
      const trimmed = value.trim();
      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }
    });
  };

  const setPeopleFilters = (filters: PeopleFiltersValue) => {
    replaceParams((params) => {
      params.set("type", "PEOPLE");
      if (filters.city) {
        params.set("city", filters.city);
      } else {
        params.delete("city");
      }
      params.set("sort", filters.sort);
      if (filters.memberSince !== "ALL") {
        params.set("memberSince", filters.memberSince);
      } else {
        params.delete("memberSince");
      }
    });
  };

  const setCarsFilters = (filters: CarsFiltersValue) => {
    replaceParams((params) => {
      params.set("type", "CARS");
      if (filters.stage) {
        params.set("stage", filters.stage);
      } else {
        params.delete("stage");
      }
      params.set("sort", filters.sort);
    });
  };

  const trimmed = query.trim();

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-3">
        <h1 className="text-lg font-semibold">Explorar</h1>
        <div className="relative">
          <Input
            placeholder="Buscar membros, carros, flagrados…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Buscar"
            className="pl-10"
          />
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
        </div>
        <div role="tablist" className="flex gap-2 overflow-x-auto no-scrollbar">
          {TYPES.map((item) => {
            const active = item.value === type;
            return (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setType(item.value)}
                className={cn(
                  "h-9 px-4 rounded-pill border border-border-default bg-bg-surface text-sm text-fg-secondary whitespace-nowrap",
                  active && "bg-fg-primary text-fg-inverted border-fg-primary",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {trimmed.length > 0 ? (
        <SearchResults query={trimmed} type={type} />
      ) : type === "ALL" ? (
        <BrowseAll onSeePeople={() => setType("PEOPLE")} />
      ) : type === "PEOPLE" ? (
        <BrowsePeople filters={peopleFilters} onFiltersChange={setPeopleFilters} />
      ) : type === "CARS" ? (
        <BrowseCars
          filters={carsFilters}
          onFiltersChange={setCarsFilters}
          ownerFilter={ownerFilter}
          onClearOwner={() =>
            replaceParams((params) => {
              params.delete("owner");
            })
          }
        />
      ) : (
        <BrowseSightings />
      )}
    </div>
  );
}

export default function ExplorePage(): JSX.Element {
  return (
    <AppShell>
      <RequireAuth>
        <Suspense fallback={<StatePanel kind="loading" />}>
          <Content />
        </Suspense>
      </RequireAuth>
    </AppShell>
  );
}
