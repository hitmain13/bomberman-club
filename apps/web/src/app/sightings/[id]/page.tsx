"use client";

import Link from "next/link";
import { use } from "react";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { AppShell } from "@/components/templates/AppShell";
import { SightingDetailView } from "@/features/sightings/components/SightingDetailView/SightingDetailView";
import { RequireAuth } from "@/shared/contexts/require-auth";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SightingDetailPage({ params }: PageProps): JSX.Element {
  const resolved = use(params);
  return (
    <AppShell>
      <RequireAuth>
        <header className="flex items-center justify-between pb-4">
          <Link href="/sightings">
            <Button variant="ghost" size="sm" leadingIcon={<Icon name="arrow-left" />}>
              Voltar
            </Button>
          </Link>
          <h1 className="text-base font-semibold">Flagrado</h1>
          <span aria-hidden="true" className="w-12" />
        </header>
        <SightingDetailView id={resolved.id} />
      </RequireAuth>
    </AppShell>
  );
}
