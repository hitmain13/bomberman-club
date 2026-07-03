"use client";

import { StatePanel } from "@/components/organisms/StatePanel";
import { CarCard } from "@/features/garage";
import { SightingCard } from "@/features/sightings";
import { cn } from "@/shared/utils/cn";

import { useLikedItems } from "../../hooks/use-liked-items";

import { styles } from "./ProfileLikesTab.styles";
import type { ProfileLikesTabProps } from "./ProfileLikesTab.types";

export function ProfileLikesTab({ username, className }: ProfileLikesTabProps): JSX.Element {
  const { data, isLoading, error } = useLikedItems(username);

  if (isLoading) {
    return <StatePanel kind="loading" />;
  }
  if (error || !data) {
    return <StatePanel kind="error" description="Não foi possível carregar as curtidas." />;
  }
  if (data.items.length === 0) {
    return <StatePanel kind="empty" title="Nenhuma curtida ainda." />;
  }

  return (
    <ul className={cn(styles.list, className)}>
      {data.items.map((entry) =>
        entry.kind === "CAR" ? (
          <li key={`car-${entry.item.id}`}>
            <CarCard car={entry.item} />
          </li>
        ) : (
          <li key={`sighting-${entry.item.id}`}>
            <SightingCard sighting={entry.item} />
          </li>
        ),
      )}
    </ul>
  );
}
