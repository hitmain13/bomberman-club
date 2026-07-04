import Image from "next/image";
import Link from "next/link";

import { Avatar } from "@/components/atoms/Avatar";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/shared/utils/cn";

import { formatRelative } from "../../utils/format-date";
import { formatSightingLocation } from "../../utils/format-location";

import { styles } from "./SightingCard.styles";
import type { SightingCardProps } from "./SightingCard.types";

export function SightingCard({ sighting, href, className }: SightingCardProps): JSX.Element {
  const target = href ?? `/sightings/${sighting.id}`;
  const locationText = formatSightingLocation(sighting);

  return (
    <Link href={target} className={cn(styles.root, className)} aria-label={sighting.title}>
      <div className={styles.cover}>
        <Image
          src={sighting.imageUrl}
          alt={sighting.title}
          fill
          sizes="(max-width: 768px) 100vw, 480px"
          className="object-cover"
        />
      </div>
      <div className={styles.body}>
        <header className={styles.header}>
          <Avatar
            src={sighting.author.avatarUrl}
            alt={sighting.author.username}
            size="sm"
            className={styles.avatar}
          />
          <div className={styles.meta}>
            <span className={styles.username}>@{sighting.author.username}</span>
            <span className={styles.city}>{formatRelative(sighting.occurredAt)}</span>
          </div>
        </header>
        <h3 className={styles.title}>{sighting.title}</h3>
        {sighting.description ? <p className={styles.description}>{sighting.description}</p> : null}
        <p className={styles.location}>
          <Icon name="map" size="sm" className={styles.locationIcon} />
          <span className="truncate">{locationText}</span>
        </p>
      </div>
    </Link>
  );
}
