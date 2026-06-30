import { styles } from "./ComponentName.styles";
import type { ComponentNameProps } from "./ComponentName.types";

export function ComponentName({ label }: ComponentNameProps): JSX.Element {
  return <div className={styles.root}>{label}</div>;
}
