import Image from "next/image";

import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";

import { styles } from "./CarDetailHeader.styles";
import type { CarDetailHeaderProps } from "./CarDetailHeader.types";

export function CarDetailHeader({ car, stageBadge }: CarDetailHeaderProps): JSX.Element {
  return (
    <section className={styles.root}>
      <div className={styles.cover}>
        {car.coverUrl ? (
          <Image
            src={car.coverUrl}
            alt={car.nickname}
            fill
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <span className={styles.placeholder}>
            <Icon name="camera" size="lg" aria-label="Sem foto" />
          </span>
        )}
        <div className={styles.badges}>
          <Badge variant="primary">{car.year}</Badge>
          {stageBadge ? <Badge variant="success">{stageBadge}</Badge> : null}
        </div>
      </div>
      <div className={styles.identity}>
        <div className={styles.title}>
          <h1 className={styles.nickname}>{car.nickname}</h1>
          <p className={styles.subtitle}>
            {car.brand} {car.model}
            {car.generation ? ` · ${car.generation}` : ""}
          </p>
        </div>
      </div>
      <p className={styles.meta}>
        {car.engine} · {car.fuel.toLowerCase()}
      </p>
    </section>
  );
}
