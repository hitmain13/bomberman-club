"use client";

import Link from "next/link";
import { use } from "react";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import { EditSightingForm } from "@/features/sightings/components/EditSightingForm/EditSightingForm";
import { useSighting } from "@/features/sightings/hooks/use-sightings";
import { canManageSighting } from "@/features/sightings/utils/can-manage-sighting";
import { useAuth } from "@/shared/contexts/auth-context";
import { RequireAuth } from "@/shared/contexts/require-auth";

interface PageProps {
  params: Promise<{ id: string }>;
}

function Content({ id }: { id: string }): JSX.Element {
  const { user } = useAuth();
  const { data, isLoading, error } = useSighting(id);

  if (isLoading) {
    return <StatePanel kind="loading" />;
  }
  if (error || !data) {
    return <StatePanel kind="error" description="Flagrado não encontrado." />;
  }
  if (!canManageSighting(user, data.userId)) {
    return <StatePanel kind="error" description="Você não pode editar este flagrado." />;
  }

  return <EditSightingForm sighting={data} />;
}

export default function EditSightingPage({ params }: PageProps): JSX.Element {
  const resolved = use(params);
  return (
    <AppShell>
      <RequireAuth>
        <header className="flex items-center justify-between pb-4">
          <Link href={`/sightings/${resolved.id}`}>
            <Button variant="ghost" size="sm" leadingIcon={<Icon name="arrow-left" />}>
              Voltar
            </Button>
          </Link>
          <h1 className="text-base font-semibold">Editar flagrado</h1>
          <span aria-hidden="true" className="w-12" />
        </header>
        <Content id={resolved.id} />
      </RequireAuth>
    </AppShell>
  );
}
