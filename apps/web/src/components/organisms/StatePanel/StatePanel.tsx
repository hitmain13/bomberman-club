import { Icon, type IconName } from "@/components/atoms/Icon";
import { Spinner } from "@/components/atoms/Spinner";
import { cn } from "@/shared/utils/cn";

import { styles } from "./StatePanel.styles";
import type { StatePanelKind, StatePanelProps } from "./StatePanel.types";

const defaultIcon: Record<StatePanelKind, IconName> = {
  loading: "search",
  empty: "search",
  error: "x",
};

const defaultTitle: Record<StatePanelKind, string> = {
  loading: "Carregando…",
  empty: "Nada por aqui ainda.",
  error: "Algo deu errado.",
};

export function StatePanel({
  kind,
  title,
  description,
  icon,
  action,
  className,
}: StatePanelProps): JSX.Element {
  return (
    <div className={cn(styles.root, className)} role={kind === "error" ? "alert" : "status"}>
      <div className={styles.iconWrap} aria-hidden="true">
        {kind === "loading" ? <Spinner size="md" /> : <Icon name={icon ?? defaultIcon[kind]} />}
      </div>
      <p className={styles.title}>{title ?? defaultTitle[kind]}</p>
      {description ? <p className={styles.description}>{description}</p> : null}
      {action}
    </div>
  );
}
