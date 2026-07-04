"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { AppShell } from "@/components/templates/AppShell";
import { getAuthErrorMessage } from "@/features/auth/utils/error-message";
import { NewSightingForm, useCreateSighting } from "@/features/sightings";
import { RequireAuth } from "@/shared/contexts/require-auth";

function Content(): JSX.Element {
  const searchParams = useSearchParams();
  const autoCapture = searchParams.get("capture") === "1";
  const mutation = useCreateSighting();
  return (
    <NewSightingForm
      autoCapture={autoCapture}
      onSubmit={(input) => mutation.mutate(input)}
      isSubmitting={mutation.isPending}
      errorMessage={mutation.error ? getAuthErrorMessage(mutation.error) : null}
    />
  );
}

export default function NewSightingPage(): JSX.Element {
  return (
    <AppShell hideBottomNav>
      <RequireAuth>
        <header className="flex items-center justify-between pb-4">
          <Link href="/sightings">
            <Button variant="ghost" size="sm" leadingIcon={<Icon name="arrow-left" />}>
              Voltar
            </Button>
          </Link>
          <h1 className="text-base font-semibold">Novo flagrado</h1>
          <span aria-hidden="true" className="w-12" />
        </header>
        <Suspense fallback={null}>
          <Content />
        </Suspense>
      </RequireAuth>
    </AppShell>
  );
}
