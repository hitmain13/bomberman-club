import { cn } from "@/shared/utils/cn";

import { gridColumnsClassName, styles } from "./ProfileStats.styles";
import type { ProfileStatsProps } from "./ProfileStats.types";

const NUMBER_FORMAT = new Intl.NumberFormat("pt-BR");

export function ProfileStats({ items, className }: ProfileStatsProps): JSX.Element {
  return (
    <dl className={cn(styles.root, gridColumnsClassName(items.length), className)}>
      {items.map((item) => (
        <div key={item.label} className={styles.item}>
          <dt className={styles.label}>{item.label}</dt>
          <dd className={styles.value}>{NUMBER_FORMAT.format(item.value)}</dd>
        </div>
      ))}
    </dl>
  );
}
