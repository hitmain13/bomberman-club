"use client";

import Link from "next/link";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import { CarList, useMyCars } from "@/features/garage";
import { RequireAuth } from "@/shared/contexts/require-auth";

function MyCarsContent(): JSX.Element {
  const { data, isLoading, error } = useMyCars();

  if (isLoading) {
    return <StatePanel kind="loading" />;
  }
  if (error || !data) {
    return <StatePanel kind="error" description="Não foi possível carregar seus carros." />;
  }
  if (data.length === 0) {
    return (
      <StatePanel
        kind="empty"
        title="Você ainda não cadastrou carros."
        description="Adicione seu primeiro carro para mostrar seu setup."
        action={
          <Link href="/me/cars/new">
            <Button leadingIcon={<Icon name="plus" />}>Adicionar carro</Button>
          </Link>
        }
      />
    );
  }
  return <CarList cars={data} />;
}

export default function MyCarsPage(): JSX.Element {
  return (
    <AppShell>
      <RequireAuth>
        <header className="flex items-center justify-between pb-4">
          <h1 className="text-lg font-semibold">Meus carros</h1>
          <Link href="/me/cars/new">
            <Button size="sm" leadingIcon={<Icon name="plus" />}>
              Novo
            </Button>
          </Link>
        </header>
        <MyCarsContent />
      </RequireAuth>
    </AppShell>
  );
}
