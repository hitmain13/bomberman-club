"use client";

import { Suspense } from "react";

import { FeedScopeSchema } from "@bomberman/types";

import { Logo } from "@/components/atoms/Logo";
import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import { FeedTabs, useFeed } from "@/features/discovery";
import { CarCard } from "@/features/garage";
import { SightingCard } from "@/features/sightings";
import { RequireAuth } from "@/shared/contexts/require-auth";
import { parseEnumParam, useFilterParams } from "@/shared/hooks/use-filter-params";

function Content(): JSX.Element {
  const { searchParams, setParam } = useFilterParams();
  const scope = parseEnumParam(searchParams.get("scope"), FeedScopeSchema, "RECENT");
  const { data, isLoading, error } = useFeed(scope);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <Logo size="md" />
      </header>
      <FeedTabs value={scope} onChange={(next) => setParam("scope", next, "RECENT")} />
      {isLoading ? (
        <StatePanel kind="loading" />
      ) : error ? (
        <StatePanel kind="error" />
      ) : !data || data.items.length === 0 ? (
        <StatePanel
          kind="empty"
          title="Feed vazio"
          description="Siga membros para ver o que está rolando."
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {data.items.map((entry) =>
            entry.kind === "CAR" ? (
              <li key={`car-${entry.item.id}`}>
                <CarCard car={entry.item} />
              </li>
            ) : (
              <li key={`s-${entry.item.id}`}>
                <SightingCard sighting={entry.item} />
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}

export default function FeedPage(): JSX.Element {
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
