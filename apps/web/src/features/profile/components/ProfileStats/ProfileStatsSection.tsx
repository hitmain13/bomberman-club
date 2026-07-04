"use client";

import { useProfileStats } from "../../hooks/use-profile-stats";
import { ProfileStats } from "./ProfileStats";
import { ProfileStatsSkeleton } from "./ProfileStatsSkeleton";

interface ProfileStatsSectionProps {
  username: string;
}

export function ProfileStatsSection({ username }: ProfileStatsSectionProps): JSX.Element {
  const { data: stats, isPending } = useProfileStats(username);

  if (isPending || !stats) {
    return <ProfileStatsSkeleton count={4} />;
  }

  return (
    <ProfileStats
      items={[
        { label: "Carros", value: stats.carsCount },
        { label: "Flagrados", value: stats.sightingsCount },
        { label: "Seguidores", value: stats.followersCount },
        { label: "Seguindo", value: stats.followingCount },
      ]}
    />
  );
}
