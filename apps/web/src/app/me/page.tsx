"use client";

import Link from "next/link";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import { CarList, useMyCars } from "@/features/garage";
import { ProfileHeader, ProfileStats, type ProfileTab, ProfileTabs } from "@/features/profile";
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
  if (data.length === 0) {
    return <StatePanel kind="empty" title="Você ainda não cadastrou carros." />;
  }
  return <CarList cars={data} />;
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
  const { data: cars } = useMyCars();
  const { data: sightings } = useUserSightings(user?.username ?? "");

  if (!user) {
    return <StatePanel kind="loading" />;
  }

  const carsCount = cars?.length ?? 0;
  const sightingsCount = sightings?.length ?? 0;
  const tabs: ReadonlyArray<ProfileTab> = [
    { id: "cars", label: "Carros", content: <MyCarsTab /> },
    {
      id: "sightings",
      label: "Flagrados",
      content: <MySightingsTab username={user.username} />,
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
      <ProfileStats
        items={[
          { label: "Carros", value: carsCount },
          { label: "Flagrados", value: sightingsCount },
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
