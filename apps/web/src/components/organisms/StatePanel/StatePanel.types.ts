import type { IconName } from "@/components/atoms/Icon";
import type { ReactNode } from "react";

export type StatePanelKind = "loading" | "empty" | "error";

export interface StatePanelProps {
  kind: StatePanelKind;
  title?: string;
  description?: string;
  icon?: IconName;
  action?: ReactNode;
  className?: string;
}
