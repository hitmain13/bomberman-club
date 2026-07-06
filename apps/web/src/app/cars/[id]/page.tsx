"use client";

import Link from "next/link";
import { use } from "react";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import {
  CarDetailHeader,
  CarMetricsGrid,
  CarPartsList,
  CarSpecsList,
  useCar,
  useCarParts,
  useCarSpecs,
} from "@/features/cars";
import { useMyCars } from "@/features/garage";
import { useAuth } from "@/shared/contexts/auth-context";
import { RequireAuth } from "@/shared/contexts/require-auth";

interface PageProps {
  params: Promise<{ id: string }>;
}

function CarDetailContent({ id }: { id: string }): JSX.Element {
  const { user } = useAuth();
  const myCars = useMyCars();
  const carQuery = useCar(id);
  const partsQuery = useCarParts(id);
  const specsQuery = useCarSpecs(id);

  if (carQuery.isLoading) {
    return <StatePanel kind="loading" />;
  }
  if (carQuery.error || !carQuery.data) {
    return <StatePanel kind="error" description="Não foi possível carregar este carro." />;
  }

  const car = carQuery.data;
  const stageSpec = specsQuery.data?.find((spec) => spec.definition.key === "stage");
  const stageLabel = stageSpec?.valueString ?? null;
  const isOwner =
    user !== null &&
    (user.role === "ADMIN" || myCars.data?.some((entry) => entry.id === id) === true);

  return (
    <div className="flex flex-col gap-6">
      <CarDetailHeader car={car} stageBadge={stageLabel} />
      <CarMetricsGrid car={car} />

      <section className="flex flex-col gap-3">
        <header className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-muted">Peças</h2>
          {isOwner ? (
            <Link href={`/me/cars/${car.id}/parts`}>
              <Button variant="ghost" size="sm" trailingIcon={<Icon name="chevron-right" />}>
                Editar
              </Button>
            </Link>
          ) : null}
        </header>
        {partsQuery.isLoading ? (
          <StatePanel kind="loading" />
        ) : partsQuery.data && partsQuery.data.length > 0 ? (
          <CarPartsList parts={partsQuery.data} readOnly />
        ) : (
          <StatePanel kind="empty" title="Sem peças cadastradas." />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <header className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-muted">
            Especificações
          </h2>
          {isOwner ? (
            <Link href={`/me/cars/${car.id}/specs`}>
              <Button variant="ghost" size="sm" trailingIcon={<Icon name="chevron-right" />}>
                Editar
              </Button>
            </Link>
          ) : null}
        </header>
        {specsQuery.isLoading ? (
          <StatePanel kind="loading" />
        ) : specsQuery.data && specsQuery.data.length > 0 ? (
          <CarSpecsList specs={specsQuery.data} />
        ) : (
          <StatePanel kind="empty" title="Sem especificações cadastradas." />
        )}
      </section>

      {isOwner ? (
        <Link href={`/me/cars/${car.id}/edit`} className="block pt-2">
          <Button variant="secondary" fullWidth>
            Editar carro
          </Button>
        </Link>
      ) : null}
    </div>
  );
}

export default function CarDetailPage({ params }: PageProps): JSX.Element {
  const resolved = use(params);
  return (
    <AppShell>
      <RequireAuth>
        <CarDetailContent id={resolved.id} />
      </RequireAuth>
    </AppShell>
  );
}
