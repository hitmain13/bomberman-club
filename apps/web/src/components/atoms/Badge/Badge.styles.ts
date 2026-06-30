import type { BadgeVariant } from "./Badge.types";

export const badgeBase = "inline-flex items-center gap-1 px-2 h-6 rounded-pill text-xs font-medium";

export const badgeVariants: Record<BadgeVariant, string> = {
  neutral: "bg-bg-elevated text-fg-secondary",
  primary: "bg-fg-primary text-fg-inverted",
  success: "bg-accent-success/20 text-accent-success",
  warning: "bg-accent-warning/20 text-accent-warning",
  danger: "bg-accent-danger/20 text-accent-danger",
};
