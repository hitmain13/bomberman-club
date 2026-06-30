"use client";

import Link from "next/link";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import { EditProfileForm } from "@/features/profile";
import { useAuth } from "@/shared/contexts/auth-context";
import { RequireAuth } from "@/shared/contexts/require-auth";

function EditContent(): JSX.Element {
  const { user } = useAuth();
  if (!user) {
    return <StatePanel kind="loading" />;
  }
  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between pb-2">
        <Link href="/me">
          <Button variant="ghost" size="sm" leadingIcon={<Icon name="arrow-left" />}>
            Voltar
          </Button>
        </Link>
        <h1 className="text-base font-semibold">Editar perfil</h1>
        <span aria-hidden="true" className="w-12" />
      </header>
      <EditProfileForm user={user} />
    </div>
  );
}

export default function EditMePage(): JSX.Element {
  return (
    <AppShell hideBottomNav>
      <RequireAuth>
        <EditContent />
      </RequireAuth>
    </AppShell>
  );
}
