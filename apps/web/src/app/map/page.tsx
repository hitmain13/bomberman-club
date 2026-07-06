"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

import { SightingPeriodSchema } from "@bomberman/types";

import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import { PeriodTabs, useSightings } from "@/features/sightings";
import { RequireAuth } from "@/shared/contexts/require-auth";
import { parseEnumParam, useFilterParams } from "@/shared/hooks/use-filter-params";

const SightingsMap = dynamic(() => import("@/features/map").then((module) => module.SightingsMap), {
  ssr: false,
  loading: () => <StatePanel kind="loading" />,
});

function Content(): JSX.Element {
  const { searchParams, setParam } = useFilterParams();
  const period = parseEnumParam(searchParams.get("period"), SightingPeriodSchema, "WEEK");
  const { data, isLoading, error } = useSightings(period);

  return (
    <div className="flex flex-col gap-3">
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Mapa</h1>
        <span className="text-xs text-fg-muted">{data?.items.length ?? 0} pins</span>
      </header>
      <PeriodTabs value={period} onChange={(next) => setParam("period", next, "WEEK")} />
      {isLoading ? (
        <StatePanel kind="loading" />
      ) : error ? (
        <StatePanel kind="error" description="Não foi possível carregar o mapa." />
      ) : (
        <SightingsMap sightings={data?.items ?? []} />
      )}
    </div>
  );
}

export default function MapPage(): JSX.Element {
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
