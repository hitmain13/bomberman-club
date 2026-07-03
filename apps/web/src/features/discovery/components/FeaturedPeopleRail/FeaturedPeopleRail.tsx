import Link from "next/link";

import { Avatar } from "@/components/atoms/Avatar";
import { cn } from "@/shared/utils/cn";

import { styles } from "./FeaturedPeopleRail.styles";
import type { FeaturedPeopleRailProps } from "./FeaturedPeopleRail.types";

export function FeaturedPeopleRail({ people, className }: FeaturedPeopleRailProps): JSX.Element {
  return (
    <section className={cn(styles.root, className)}>
      <p className={styles.title}>Em destaque</p>
      <ul className={styles.rail}>
        {people.map((person) => (
          <li key={person.id} className={styles.item}>
            <Link href={`/u/${person.username}`} className="flex flex-col items-center gap-2">
              <Avatar src={person.avatarUrl} alt={person.username} size="lg" />
              <span className={styles.username}>@{person.username}</span>
              {person.city ? <span className={styles.city}>{person.city}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
