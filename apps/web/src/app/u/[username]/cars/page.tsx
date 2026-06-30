"use client";

import { use } from "react";

import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import { CarList, useUserCars } from "@/features/garage";
import { RequireAuth } from "@/shared/contexts/require-auth";

interface PageProps {
  params: Promise<{ username: string }>;
}

function UserCarsContent({ username }: { username: string }): JSX.Element {
  const { data, isLoading, error } = useUserCars(username);

  if (isLoading) {
    return <StatePanel kind="loading" />;
  }
  if (error || !data) {
    return <StatePanel kind="error" description="Não foi possível carregar os carros." />;
  }
  if (data.length === 0) {
    return <StatePanel kind="empty" title="Nenhum carro publicado ainda." />;
  }
  return <CarList cars={data} />;
}

export default function UserCarsPage({ params }: PageProps): JSX.Element {
  const resolved = use(params);
  return (
    <AppShell>
      <RequireAuth>
        <header className="flex items-center justify-between pb-4">
          <h1 className="text-lg font-semibold">@{resolved.username}</h1>
        </header>
        <UserCarsContent username={resolved.username} />
      </RequireAuth>
    </AppShell>
  );
}
