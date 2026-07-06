"use client";

import Link from "next/link";
import { use } from "react";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import { getAuthErrorMessage } from "@/features/auth/utils/error-message";
import {
  AddCarPartForm,
  CarOwnerGuard,
  CarPartsList,
  useAddCarPart,
  useCarParts,
  useRemoveCarPart,
} from "@/features/cars";
import { RequireAuth } from "@/shared/contexts/require-auth";

interface PageProps {
  params: Promise<{ id: string }>;
}

function PartsContent({ carId }: { carId: string }): JSX.Element {
  const list = useCarParts(carId);
  const add = useAddCarPart(carId);
  const remove = useRemoveCarPart(carId);

  return (
    <CarOwnerGuard carId={carId}>
      <div className="flex flex-col gap-6">
        <AddCarPartForm
          onSubmit={(input) => add.mutate(input)}
          isSubmitting={add.isPending}
          errorMessage={add.error ? getAuthErrorMessage(add.error) : null}
        />
        {list.isLoading ? (
          <StatePanel kind="loading" />
        ) : list.error ? (
          <StatePanel kind="error" />
        ) : list.data && list.data.length > 0 ? (
          <CarPartsList parts={list.data} onRemove={(id) => remove.mutate(id)} />
        ) : (
          <StatePanel kind="empty" title="Nenhuma peça instalada ainda." />
        )}
      </div>
    </CarOwnerGuard>
  );
}

export default function CarPartsPage({ params }: PageProps): JSX.Element {
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
          <h1 className="text-base font-semibold">Peças</h1>
          <span aria-hidden="true" className="w-12" />
        </header>
        <PartsContent carId={resolved.id} />
      </RequireAuth>
    </AppShell>
  );
}
