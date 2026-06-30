"use client";

import Link from "next/link";
import { use } from "react";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import { getAuthErrorMessage } from "@/features/auth/utils/error-message";
import { CarForm, useCar, useDeleteCar, useUpdateCar } from "@/features/cars";
import { RequireAuth } from "@/shared/contexts/require-auth";

interface PageProps {
  params: Promise<{ id: string }>;
}

function EditCarContent({ id }: { id: string }): JSX.Element {
  const { data: car, isLoading, error } = useCar(id);
  const update = useUpdateCar(id);
  const remove = useDeleteCar(id);

  if (isLoading) {
    return <StatePanel kind="loading" />;
  }
  if (error || !car) {
    return <StatePanel kind="error" description="Não foi possível carregar o carro." />;
  }

  return (
    <div className="flex flex-col gap-6">
      <CarForm
        garageId={car.garageId}
        initialCar={car}
        onSubmit={(values) => update.mutate(values)}
        isSubmitting={update.isPending}
        errorMessage={update.error ? getAuthErrorMessage(update.error) : null}
      />
      <Button
        variant="danger"
        fullWidth
        isLoading={remove.isPending}
        onClick={() => {
          if (window.confirm("Tem certeza? Esta ação não pode ser desfeita.")) {
            remove.mutate();
          }
        }}
      >
        Excluir carro
      </Button>
    </div>
  );
}

export default function EditCarPage({ params }: PageProps): JSX.Element {
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
          <h1 className="text-base font-semibold">Editar carro</h1>
          <span aria-hidden="true" className="w-12" />
        </header>
        <EditCarContent id={resolved.id} />
      </RequireAuth>
    </AppShell>
  );
}
