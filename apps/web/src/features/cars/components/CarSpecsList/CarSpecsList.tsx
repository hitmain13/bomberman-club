import { formatSpecValue } from "@bomberman/types";

import { cn } from "@/shared/utils/cn";

import { styles } from "./CarSpecsList.styles";
import type { CarSpecsListProps } from "./CarSpecsList.types";

export function CarSpecsList({ specs, className }: CarSpecsListProps): JSX.Element {
  return (
    <dl className={cn(styles.root, className)}>
      {specs.map((spec) => (
        <div key={spec.id} className={styles.item}>
          <dt className={styles.label}>{spec.definition.name}</dt>
          <dd className={styles.value}>{formatSpecValue(spec)}</dd>
        </div>
      ))}
    </dl>
  );
}
