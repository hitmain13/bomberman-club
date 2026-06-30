"use client";

import { useState } from "react";

import type { RankingMetric } from "@bomberman/types";

import { Badge } from "@/components/atoms/Badge";
import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import { useRanking } from "@/features/discovery";
import { CarCard, formatRatio } from "@/features/garage";
import { RequireAuth } from "@/shared/contexts/require-auth";
import { cn } from "@/shared/utils/cn";

const METRICS: ReadonlyArray<{ value: RankingMetric; label: string; unit: string }> = [
  { value: "POWER", label: "Mais potência", unit: "cv" },
  { value: "WEIGHT_TO_POWER", label: "Melhor peso/pot.", unit: "kg/cv" },
  { value: "POWER_TO_WEIGHT", label: "Pot./peso", unit: "cv/ton" },
  { value: "TORQUE", label: "Mais torque", unit: "Nm" },
];

function Content(): JSX.Element {
  const [metric, setMetric] = useState<RankingMetric>("POWER");
  const { data, isLoading, error } = useRanking(metric);
  const current = METRICS.find((item) => item.value === metric);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Ranking</h1>
      </header>
      <div role="tablist" className="flex gap-2 overflow-x-auto no-scrollbar">
        {METRICS.map((item) => {
          const active = item.value === metric;
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setMetric(item.value)}
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
      {isLoading ? (
        <StatePanel kind="loading" />
      ) : error ? (
        <StatePanel kind="error" />
      ) : !data || data.items.length === 0 ? (
        <StatePanel kind="empty" title="Ranking vazio" />
      ) : (
        <ol className="flex flex-col gap-3">
          {data.items.map((entry, index) => (
            <li key={entry.car.id} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs text-fg-muted">
                <span>
                  #{index + 1} · @{entry.owner.username}
                </span>
                <Badge variant="primary">
                  {formatRatio(entry.metric)} {current?.unit ?? ""}
                </Badge>
              </div>
              <CarCard car={entry.car} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default function RankingPage(): JSX.Element {
  return (
    <AppShell>
      <RequireAuth>
        <Content />
      </RequireAuth>
    </AppShell>
  );
}
