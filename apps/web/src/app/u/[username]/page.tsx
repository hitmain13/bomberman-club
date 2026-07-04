"use client";

import { use } from "react";

import { Button } from "@/components/atoms/Button";
import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import { CarList, useUserCars } from "@/features/garage";
import {
  ProfileAboutTab,
  ProfileHeader,
  ProfileLikesTab,
  ProfileStatsSection,
  type ProfileTab,
  ProfileTabs,
  useProfileStats,
  usePublicProfile,
} from "@/features/profile";
import { SightingCard, useUserSightings } from "@/features/sightings";
import { FollowButton } from "@/features/social";
import { useAuth } from "@/shared/contexts/auth-context";
import { RequireAuth } from "@/shared/contexts/require-auth";

interface PageProps {
  params: Promise<{ username: string }>;
}

function UserCarsTab({ username }: { username: string }): JSX.Element {
  const { data, isLoading, error } = useUserCars(username);
  if (isLoading) {
    return <StatePanel kind="loading" />;
  }
  if (error || !data) {
    return <StatePanel kind="error" />;
  }
  if (data.length === 0) {
    return <StatePanel kind="empty" title="Nenhum carro publicado." />;
  }
  return <CarList cars={data} />;
}

function UserSightingsTab({ username }: { username: string }): JSX.Element {
  const { data, isLoading, error } = useUserSightings(username);
  if (isLoading) {
    return <StatePanel kind="loading" />;
  }
  if (error || !data) {
    return <StatePanel kind="error" />;
  }
  if (data.length === 0) {
    return <StatePanel kind="empty" title="Sem flagrados." />;
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

function UserProfileContent({ username }: { username: string }): JSX.Element {
  const { user: currentUser } = useAuth();
  const { data, isLoading, error } = usePublicProfile(username);
  const { data: stats } = useProfileStats(username);

  if (isLoading) {
    return <StatePanel kind="loading" />;
  }
  if (error || !data) {
    return <StatePanel kind="error" description="Não foi possível carregar este perfil." />;
  }

  const isOwn = currentUser?.username === data.username;
  const tabs: ReadonlyArray<ProfileTab> = [
    {
      id: "about",
      label: "Sobre",
      content: (
        <ProfileAboutTab
          bio={data.bio}
          city={data.city}
          memberSince={data.createdAt}
          carsCount={stats?.carsCount}
          sightingsCount={stats?.sightingsCount}
        />
      ),
    },
    { id: "cars", label: "Carros", content: <UserCarsTab username={username} /> },
    {
      id: "sightings",
      label: "Flagrados",
      content: <UserSightingsTab username={username} />,
    },
    {
      id: "likes",
      label: "Curtidas",
      content: <ProfileLikesTab username={username} />,
    },
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
            <FollowButton
              username={data.username}
              initialFollowing={stats?.isFollowedByMe ?? false}
            />
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
      <ProfileStatsSection username={username} />
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
