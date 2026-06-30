"use client";

import Link from "next/link";
import { useState } from "react";

import type { SearchType } from "@bomberman/types";

import { Avatar } from "@/components/atoms/Avatar";
import { Icon } from "@/components/atoms/Icon";
import { Input } from "@/components/atoms/Input";
import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import { useSearch } from "@/features/discovery";
import { CarCard } from "@/features/garage";
import { SightingCard } from "@/features/sightings";
import { RequireAuth } from "@/shared/contexts/require-auth";
import { cn } from "@/shared/utils/cn";

const TYPES: ReadonlyArray<{ value: SearchType; label: string }> = [
  { value: "ALL", label: "Tudo" },
  { value: "PEOPLE", label: "Pessoas" },
  { value: "CARS", label: "Carros" },
  { value: "SIGHTINGS", label: "Flagrados" },
];

function Content(): JSX.Element {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<SearchType>("ALL");
  const { data, isLoading, error } = useSearch(query, type);
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
      {trimmed.length === 0 ? (
        <StatePanel kind="empty" title="Comece a digitar para buscar." />
      ) : isLoading ? (
        <StatePanel kind="loading" />
      ) : error ? (
        <StatePanel kind="error" />
      ) : !data ||
        (data.people.length === 0 && data.cars.length === 0 && data.sightings.length === 0) ? (
        <StatePanel kind="empty" title="Nada encontrado" description="Tente outro termo." />
      ) : (
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
                        <span className="text-sm font-semibold text-fg-primary">
                          @{user.username}
                        </span>
                        {user.city ? (
                          <span className="text-xs text-fg-muted">{user.city}</span>
                        ) : null}
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
      )}
    </div>
  );
}

export default function ExplorePage(): JSX.Element {
  return (
    <AppShell>
      <RequireAuth>
        <Content />
      </RequireAuth>
    </AppShell>
  );
}
