"use client";

import Link from "next/link";
import { use } from "react";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import { getAuthErrorMessage } from "@/features/auth/utils/error-message";
import {
  CarOwnerGuard,
  CarSpecsList,
  SetCarSpecForm,
  useCarSpecs,
  useSetCarSpec,
  useSpecDefinitions,
} from "@/features/cars";
import { RequireAuth } from "@/shared/contexts/require-auth";

interface PageProps {
  params: Promise<{ id: string }>;
}

function SpecsContent({ carId }: { carId: string }): JSX.Element {
  const list = useCarSpecs(carId);
  const definitions = useSpecDefinitions();
  const set = useSetCarSpec(carId);

  if (definitions.isLoading) {
    return <StatePanel kind="loading" />;
  }
  if (definitions.error) {
    return <StatePanel kind="error" description="Não foi possível carregar as especificações." />;
  }
  if (!definitions.data || definitions.data.length === 0) {
    return <StatePanel kind="empty" title="Catálogo de especificações indisponível." />;
  }

  return (
    <CarOwnerGuard carId={carId}>
      <div className="flex flex-col gap-6">
        <SetCarSpecForm
          definitions={definitions.data}
          onSubmit={(input) => set.mutate(input)}
          isSubmitting={set.isPending}
          errorMessage={set.error ? getAuthErrorMessage(set.error) : null}
        />
        {list.isLoading ? (
          <StatePanel kind="loading" />
        ) : list.error ? (
          <StatePanel kind="error" />
        ) : list.data && list.data.length > 0 ? (
          <CarSpecsList specs={list.data} />
        ) : (
          <StatePanel kind="empty" title="Nenhuma especificação definida." />
        )}
      </div>
    </CarOwnerGuard>
  );
}

export default function CarSpecsPage({ params }: PageProps): JSX.Element {
  const resolved = use(params);
  return (
    <AppShell hideBottomNav>
      <RequireAuth>
        <header className="flex items-center justify-between pb-4">
          <Link href={`/cars/${resolved.id}`}>
            <Button variant="ghost" size="sm" leadingIcon={<Icon name="arrow-left" />}>
              Voltar
            </Button>
          </Link>
          <h1 className="text-base font-semibold">Especificações</h1>
          <span aria-hidden="true" className="w-12" />
        </header>
        <SpecsContent carId={resolved.id} />
      </RequireAuth>
    </AppShell>
  );
}
