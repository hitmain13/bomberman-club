import Link from "next/link";

import { Avatar } from "@/components/atoms/Avatar";
import { FollowButton } from "@/features/social";
import { cn } from "@/shared/utils/cn";

import { styles } from "./PersonListItem.styles";
import type { PersonListItemProps } from "./PersonListItem.types";

const NUMBER_FORMAT = new Intl.NumberFormat("pt-BR", { notation: "compact" });

export function PersonListItem({ person, className }: PersonListItemProps): JSX.Element {
  return (
    <li className={cn(styles.root, className)}>
      <Link href={`/u/${person.username}`} className={styles.identity}>
        <Avatar src={person.avatarUrl} alt={person.username} size="md" />
        <div className={styles.info}>
          <span className={styles.username} title={`@${person.username}`}>
            @{person.username}
          </span>
          <span className={styles.city}>
            {person.city ?? "Localização não informada"}
            <span className={styles.metaDivider}> · </span>
            {NUMBER_FORMAT.format(person.carsCount)} {person.carsCount === 1 ? "carro" : "carros"}
            <span className={styles.metaDivider}> · </span>
            {NUMBER_FORMAT.format(person.followersCount)} seguidores
          </span>
        </div>
      </Link>
      <div className={styles.action}>
        <FollowButton username={person.username} initialFollowing={person.isFollowedByMe} />
      </div>
    </li>
  );
}
