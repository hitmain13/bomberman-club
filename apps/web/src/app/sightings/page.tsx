"use client";

import Link from "next/link";
import { Suspense } from "react";

import { SightingPeriodSchema } from "@bomberman/types";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import { PeriodTabs, SightingCard, useSightings } from "@/features/sightings";
import { RequireAuth } from "@/shared/contexts/require-auth";
import { parseEnumParam, useFilterParams } from "@/shared/hooks/use-filter-params";

function Content(): JSX.Element {
  const { searchParams, setParam } = useFilterParams();
  const period = parseEnumParam(searchParams.get("period"), SightingPeriodSchema, "WEEK");
  const { data, isLoading, error } = useSightings(period);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Flagrados</h1>
        <Link href="/sightings/new">
          <Button size="sm" leadingIcon={<Icon name="plus" />}>
            Novo
          </Button>
        </Link>
      </header>
      <PeriodTabs value={period} onChange={(next) => setParam("period", next, "WEEK")} />
      {isLoading ? (
        <StatePanel kind="loading" />
      ) : error ? (
        <StatePanel kind="error" description="Não foi possível carregar os flagrados." />
      ) : !data || data.items.length === 0 ? (
        <StatePanel
          kind="empty"
          title="Sem flagrados ainda."
          description="Seja o primeiro a registrar um flagra."
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {data.items.map((sighting) => (
            <li key={sighting.id}>
              <SightingCard sighting={sighting} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SightingsPage(): JSX.Element {
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
