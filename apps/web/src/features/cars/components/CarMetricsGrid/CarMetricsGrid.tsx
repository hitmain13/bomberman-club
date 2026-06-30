import { calculateCarMetrics } from "@bomberman/types";

import { formatHp, formatKg, formatRatio } from "@/features/garage";
import { cn } from "@/shared/utils/cn";

import { styles } from "./CarMetricsGrid.styles";
import type { CarMetricsGridProps } from "./CarMetricsGrid.types";

const NUMBER_FORMAT = new Intl.NumberFormat("pt-BR");

interface Metric {
  label: string;
  value: string;
  unit?: string;
}

export function CarMetricsGrid({ car, className }: CarMetricsGridProps): JSX.Element {
  const ratios = calculateCarMetrics({
    weightKg: car.weightKg,
    horsepowerHp: car.horsepowerHp,
    torqueNm: car.torqueNm,
  });
  const items: ReadonlyArray<Metric> = [
    { label: "Potência", value: formatHp(car.horsepowerHp) },
    { label: "Torque", value: `${NUMBER_FORMAT.format(car.torqueNm)} Nm` },
    { label: "Peso", value: formatKg(car.weightKg) },
    { label: "Peso/Pot.", value: formatRatio(ratios.weightToPowerKgPerHp), unit: "kg/cv" },
    { label: "Quilometragem", value: `${NUMBER_FORMAT.format(car.currentKm)} km` },
    { label: "Pot./Peso", value: formatRatio(ratios.powerToWeightHpPerTon), unit: "cv/ton" },
  ];
  return (
    <dl className={cn(styles.root, className)}>
      {items.map((item) => (
        <div key={item.label} className={styles.item}>
          <dt className={styles.label}>{item.label}</dt>
          <dd className={styles.value}>
            {item.value}
            {item.unit ? <span className={styles.unit}>{item.unit}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
