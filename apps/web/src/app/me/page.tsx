"use client";

import Link from "next/link";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import { CarList, useMyCars } from "@/features/garage";
import {
  ProfileAboutTab,
  ProfileHeader,
  ProfileLikesTab,
  ProfileStatsSection,
  type ProfileTab,
  ProfileTabs,
  useProfileStats,
} from "@/features/profile";
import { SightingCard, useUserSightings } from "@/features/sightings";
import { useAuth } from "@/shared/contexts/auth-context";
import { RequireAuth } from "@/shared/contexts/require-auth";

function MyCarsTab(): JSX.Element {
  const { data, isLoading, error } = useMyCars();

  if (isLoading) {
    return <StatePanel kind="loading" />;
  }
  if (error || !data) {
    return <StatePanel kind="error" />;
  }

  return (
    <div className="flex flex-col gap-3">
      <Link href="/me/cars/new">
        <Button variant="secondary" fullWidth leadingIcon={<Icon name="plus" />}>
          Adicionar carro
        </Button>
      </Link>
      {data.length === 0 ? (
        <StatePanel
          kind="empty"
          title="Você ainda não cadastrou carros."
          description="Adicione seu primeiro carro para mostrar seu setup."
        />
      ) : (
        <CarList cars={data} />
      )}
    </div>
  );
}

function MySightingsTab({ username }: { username: string }): JSX.Element {
  const { data, isLoading, error } = useUserSightings(username);
  if (isLoading) {
    return <StatePanel kind="loading" />;
  }
  if (error || !data) {
    return <StatePanel kind="error" />;
  }
  if (data.length === 0) {
    return <StatePanel kind="empty" title="Sem flagrados ainda." />;
  }
  return (
    <ul className="flex flex-col gap-4">
      {data.map((sighting) => (
        <li key={sighting.id}>
          <SightingCard sighting={sighting} />
        </li>
      ))}
    </ul>
  );
}

function MyProfileContent(): JSX.Element {
  const { user } = useAuth();
  const { data: stats } = useProfileStats(user?.username ?? "");

  if (!user) {
    return <StatePanel kind="loading" />;
  }

  const tabs: ReadonlyArray<ProfileTab> = [
    {
      id: "about",
      label: "Sobre",
      content: (
        <ProfileAboutTab
          bio={user.bio}
          city={user.city}
          memberSince={user.createdAt}
          carsCount={stats?.carsCount}
          sightingsCount={stats?.sightingsCount}
        />
      ),
    },
    { id: "cars", label: "Carros", content: <MyCarsTab /> },
    {
      id: "sightings",
      label: "Flagrados",
      content: <MySightingsTab username={user.username} />,
    },
    {
      id: "likes",
      label: "Curtidas",
      content: <ProfileLikesTab username={user.username} />,
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
          <div className="flex gap-2">
            <Link href="/notifications" className="flex-1">
              <Button variant="ghost" fullWidth leadingIcon={<Icon name="bell" />}>
                Notificações
              </Button>
            </Link>
            <Link href="/settings">
              <Button
                variant="ghost"
                leadingIcon={<Icon name="settings" />}
                aria-label="Configurações"
              >
                <span className="sr-only">Configurações</span>
              </Button>
            </Link>
          </div>
        }
      />
      <ProfileStatsSection username={user.username} />
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
