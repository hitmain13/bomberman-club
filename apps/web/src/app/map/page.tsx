"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import type { SightingPeriod } from "@bomberman/types";

import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import { PeriodTabs, useSightings } from "@/features/sightings";
import { RequireAuth } from "@/shared/contexts/require-auth";

const SightingsMap = dynamic(() => import("@/features/map").then((module) => module.SightingsMap), {
  ssr: false,
  loading: () => <StatePanel kind="loading" />,
});

function Content(): JSX.Element {
  const [period, setPeriod] = useState<SightingPeriod>("WEEK");
  const { data, isLoading, error } = useSightings(period);

  return (
    <div className="flex flex-col gap-3">
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Mapa</h1>
        <span className="text-xs text-fg-muted">{data?.items.length ?? 0} pins</span>
      </header>
      <PeriodTabs value={period} onChange={setPeriod} />
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
        <Content />
      </RequireAuth>
    </AppShell>
  );
}
