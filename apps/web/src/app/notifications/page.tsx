"use client";

import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import { NotificationsList, useMarkNotificationRead, useNotifications } from "@/features/social";
import { RequireAuth } from "@/shared/contexts/require-auth";

function Content(): JSX.Element {
  const { data, isLoading, error } = useNotifications();
  const markRead = useMarkNotificationRead();

  if (isLoading) {
    return <StatePanel kind="loading" />;
  }
  if (error) {
    return <StatePanel kind="error" />;
  }
  if (!data || data.length === 0) {
    return (
      <StatePanel
        kind="empty"
        title="Sem notificações"
        description="Quando alguém interagir com você, aparece aqui."
      />
    );
  }
  return <NotificationsList notifications={data} onRead={(id) => markRead.mutate(id)} />;
}

export default function NotificationsPage(): JSX.Element {
  return (
    <AppShell>
      <RequireAuth>
        <h1 className="pb-4 text-lg font-semibold">Notificações</h1>
        <Content />
      </RequireAuth>
    </AppShell>
  );
}
