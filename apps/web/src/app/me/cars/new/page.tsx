"use client";

import Link from "next/link";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import { getAuthErrorMessage } from "@/features/auth/utils/error-message";
import { CarForm, useCreateCar } from "@/features/cars";
import { usePrimaryGarage } from "@/features/garage";
import { RequireAuth } from "@/shared/contexts/require-auth";

function NewCarContent(): JSX.Element {
  const { primary, isLoading } = usePrimaryGarage();
  const mutation = useCreateCar();
  if (isLoading || !primary) {
    return <StatePanel kind="loading" />;
  }
  return (
    <CarForm
      garageId={primary.id}
      onSubmit={(values) => mutation.mutate(values)}
      isSubmitting={mutation.isPending}
      errorMessage={mutation.error ? getAuthErrorMessage(mutation.error) : null}
    />
  );
}

export default function NewCarPage(): JSX.Element {
  return (
    <AppShell hideBottomNav>
      <RequireAuth>
        <header className="flex items-center justify-between pb-4">
          <Link href="/me/cars">
            <Button variant="ghost" size="sm" leadingIcon={<Icon name="arrow-left" />}>
              Voltar
            </Button>
          </Link>
          <h1 className="text-base font-semibold">Novo carro</h1>
          <span aria-hidden="true" className="w-12" />
        </header>
        <NewCarContent />
      </RequireAuth>
    </AppShell>
  );
}
