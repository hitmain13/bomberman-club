import { cn } from "@/shared/utils/cn";

import { styles } from "./MetricItem.styles";
import type { MetricItemProps } from "./MetricItem.types";

export function MetricItem({ label, value, unit, className }: MetricItemProps): JSX.Element {
  return (
    <div className={cn(styles.root, className)}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>
        {value}
        {unit ? <span className={styles.unit}>{unit}</span> : null}
      </span>
    </div>
  );
}
