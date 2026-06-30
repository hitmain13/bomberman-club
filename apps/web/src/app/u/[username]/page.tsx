"use client";

import { use } from "react";

import { Button } from "@/components/atoms/Button";
import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import {
  ProfileHeader,
  ProfileStats,
  type ProfileTab,
  ProfileTabs,
  usePublicProfile,
} from "@/features/profile";
import { useAuth } from "@/shared/contexts/auth-context";
import { RequireAuth } from "@/shared/contexts/require-auth";

interface PageProps {
  params: Promise<{ username: string }>;
}

function UserProfileContent({ username }: { username: string }): JSX.Element {
  const { user: currentUser } = useAuth();
  const { data, isLoading, error } = usePublicProfile(username);

  if (isLoading) {
    return <StatePanel kind="loading" />;
  }
  if (error || !data) {
    return <StatePanel kind="error" description="Não foi possível carregar este perfil." />;
  }

  const isOwn = currentUser?.username === data.username;
  const tabs: ReadonlyArray<ProfileTab> = [
    {
      id: "cars",
      label: "Carros",
      content: <StatePanel kind="empty" title="Nenhum carro publicado." />,
    },
    {
      id: "sightings",
      label: "Flagrados",
      content: <StatePanel kind="empty" title="Sem flagrados." />,
    },
    { id: "gallery", label: "Galeria", content: <StatePanel kind="empty" title="Sem fotos." /> },
  ];

  return (
    <>
      <ProfileHeader
        profile={{
          username: data.username,
          displayName: data.username,
          avatarUrl: data.avatarUrl,
          city: data.city,
          bio: data.bio,
        }}
        primaryAction={
          isOwn ? null : (
            <Button fullWidth disabled>
              Seguir
            </Button>
          )
        }
        secondaryAction={
          isOwn ? null : (
            <Button variant="secondary" fullWidth disabled>
              Mensagem
            </Button>
          )
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

export default function UserProfilePage({ params }: PageProps): JSX.Element {
  const resolved = use(params);
  return (
    <AppShell>
      <RequireAuth>
        <UserProfileContent username={resolved.username} />
      </RequireAuth>
    </AppShell>
  );
}
