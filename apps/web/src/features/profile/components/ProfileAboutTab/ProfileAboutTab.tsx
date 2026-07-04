import { cn } from "@/shared/utils/cn";

import { styles } from "./ProfileAboutTab.styles";
import type { ProfileAboutTabProps } from "./ProfileAboutTab.types";

const DATE_FORMAT = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });
const NUMBER_FORMAT = new Intl.NumberFormat("pt-BR");

export function ProfileAboutTab({
  bio,
  city,
  memberSince,
  carsCount,
  sightingsCount,
  className,
}: ProfileAboutTabProps): JSX.Element {
  const memberSinceLabel = DATE_FORMAT.format(new Date(memberSince));

  return (
    <div className={cn(styles.root, className)}>
      <section className={styles.section}>
        <p className={styles.label}>Bio</p>
        {bio ? (
          <p className={styles.value}>{bio}</p>
        ) : (
          <p className={styles.empty}>Sem bio ainda.</p>
        )}
      </section>

      <section className={styles.section}>
        <p className={styles.label}>Localização</p>
        <p className={city ? styles.value : styles.empty}>{city ?? "Localização não informada."}</p>
      </section>

      <section className={styles.section}>
        <p className={styles.label}>No clube desde</p>
        <p className={styles.value}>{memberSinceLabel}</p>
      </section>

      <dl className={styles.list}>
        <div className={styles.row}>
          <dt className={styles.rowLabel}>Carros na garagem</dt>
          <dd className={styles.rowValue}>
            {carsCount === undefined ? "—" : NUMBER_FORMAT.format(carsCount)}
          </dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.rowLabel}>Flagrados publicados</dt>
          <dd className={styles.rowValue}>
            {sightingsCount === undefined ? "—" : NUMBER_FORMAT.format(sightingsCount)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
