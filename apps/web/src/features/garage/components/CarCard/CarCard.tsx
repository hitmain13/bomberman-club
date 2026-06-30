import { calculateCarMetrics } from "@bomberman/types";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";
import { MetricItem } from "@/components/molecules/MetricItem";
import { cn } from "@/shared/utils/cn";

import { formatHp, formatKg, formatRatio } from "../../utils/format";

import { styles } from "./CarCard.styles";
import type { CarCardProps } from "./CarCard.types";

export function CarCard({ car, href, className }: CarCardProps): JSX.Element {
  const target = href ?? `/cars/${car.id}`;
  const metrics = calculateCarMetrics({
    weightKg: car.weightKg,
    horsepowerHp: car.horsepowerHp,
    torqueNm: car.torqueNm,
  });
  return (
    <Link href={target} className={cn(styles.root, className)} aria-label={car.nickname}>
      <div className={styles.cover}>
        {car.coverUrl ? (
          <Image
            src={car.coverUrl}
            alt={car.nickname}
            fill
            sizes="(max-width: 768px) 100vw, 480px"
          />
        ) : (
          <span className={styles.coverPlaceholder}>
            <Icon name="camera" size="lg" aria-label="Sem foto" />
          </span>
        )}
        <span className={styles.badge}>
          <Badge variant="primary">{car.year}</Badge>
        </span>
      </div>
      <div className={styles.body}>
        <header className={styles.header}>
          <div className={styles.identity}>
            <p className={styles.nickname}>{car.nickname}</p>
            <p className={styles.subtitle}>
              {car.brand} {car.model}
              {car.generation ? ` · ${car.generation}` : ""}
            </p>
          </div>
          <Icon name="chevron-right" />
        </header>
        <div className={styles.metrics}>
          <MetricItem label="Potência" value={formatHp(car.horsepowerHp)} />
          <MetricItem label="Peso" value={formatKg(car.weightKg)} />
          <MetricItem
            label="Peso/Pot."
            value={formatRatio(metrics.weightToPowerKgPerHp)}
            unit="kg/cv"
          />
        </div>
      </div>
    </Link>
  );
}
