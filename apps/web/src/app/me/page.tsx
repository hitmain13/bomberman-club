"use client";

import Link from "next/link";

import { Button } from "@/components/atoms/Button";
import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import { ProfileHeader, ProfileStats, type ProfileTab, ProfileTabs } from "@/features/profile";
import { useAuth } from "@/shared/contexts/auth-context";
import { RequireAuth } from "@/shared/contexts/require-auth";

function MyProfileContent(): JSX.Element {
  const { user, signOut } = useAuth();
  if (!user) {
    return <StatePanel kind="loading" />;
  }
  const tabs: ReadonlyArray<ProfileTab> = [
    {
      id: "cars",
      label: "Carros",
      content: <StatePanel kind="empty" title="Você ainda não cadastrou carros." />,
    },
    {
      id: "sightings",
      label: "Flagrados",
      content: <StatePanel kind="empty" title="Sem flagrados ainda." />,
    },
    {
      id: "gallery",
      label: "Galeria",
      content: <StatePanel kind="empty" title="Sem fotos ainda." />,
    },
  ];
  return (
    <>
      <ProfileHeader
        profile={{
          username: user.username,
          displayName: user.username,
          avatarUrl: user.avatarUrl,
          city: user.city,
          bio: user.bio,
        }}
        primaryAction={
          <Link href="/me/edit">
            <Button variant="secondary" fullWidth>
              Editar perfil
            </Button>
          </Link>
        }
        secondaryAction={
          <Button variant="ghost" fullWidth onClick={() => void signOut()}>
            Sair
          </Button>
        }
      />
      <ProfileStats
        items={[
          { label: "Carros", value: 0 },
          { label: "Flagrados", value: 0 },
          { label: "Seguidores", value: 0 },
        ]}
      />
      <ProfileTabs tabs={tabs} />
    </>
  );
}

export default function MePage(): JSX.Element {
  return (
    <AppShell>
      <RequireAuth>
        <MyProfileContent />
      </RequireAuth>
    </AppShell>
  );
}
