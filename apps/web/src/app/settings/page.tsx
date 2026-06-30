"use client";

import Link from "next/link";

import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import { useAuth } from "@/shared/contexts/auth-context";
import { RequireAuth } from "@/shared/contexts/require-auth";

interface SettingItem {
  href?: string;
  label: string;
  iconLabel: string;
  description?: string;
}

const ITEMS: ReadonlyArray<SettingItem> = [
  { href: "/me/edit", label: "Conta", iconLabel: "Editar perfil" },
  { label: "Privacidade", iconLabel: "Quem pode ver seu conteúdo" },
  { label: "Notificações", iconLabel: "Preferências de notificação" },
  { label: "Segurança", iconLabel: "Senha e sessões" },
  { label: "Idioma", iconLabel: "Português (Brasil)" },
  { label: "Tema", iconLabel: "Dark" },
];

function Content(): JSX.Element {
  const { user, signOut } = useAuth();
  if (!user) {
    return <StatePanel kind="loading" />;
  }
  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/me"
        className="flex items-center gap-3 rounded-lg border border-border-subtle bg-bg-surface px-4 py-3"
      >
        <Avatar src={user.avatarUrl} alt={user.username} size="md" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-fg-primary">@{user.username}</span>
          <span className="text-xs text-fg-muted">{user.email}</span>
        </div>
      </Link>
      <ul className="flex flex-col overflow-hidden rounded-lg border border-border-subtle bg-bg-surface">
        {ITEMS.map((item) => {
          const content = (
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-fg-primary">{item.label}</span>
                <span className="text-xs text-fg-muted">{item.iconLabel}</span>
              </div>
              <Icon name="chevron-right" />
            </div>
          );
          return (
            <li key={item.label} className="border-b border-border-subtle last:border-b-0">
              {item.href ? <Link href={item.href}>{content}</Link> : content}
            </li>
          );
        })}
      </ul>
      <Button variant="danger" fullWidth onClick={() => void signOut()}>
        Sair da conta
      </Button>
    </div>
  );
}

export default function SettingsPage(): JSX.Element {
  return (
    <AppShell>
      <RequireAuth>
        <h1 className="pb-4 text-lg font-semibold">Configurações</h1>
        <Content />
      </RequireAuth>
    </AppShell>
  );
}
