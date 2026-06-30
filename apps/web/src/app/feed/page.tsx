import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";

export default function FeedPage(): JSX.Element {
  return (
    <AppShell>
      <StatePanel
        kind="empty"
        title="Feed em construção"
        description="A timeline Para você / Seguindo / Recentes chega na M9."
      />
    </AppShell>
  );
}
