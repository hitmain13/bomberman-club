import type { TextTone, TextVariant } from "./Text.types";

export const textVariants: Record<TextVariant, string> = {
  display: "text-4xl font-bold leading-tight tracking-tight",
  title: "text-2xl font-bold leading-tight tracking-tight",
  subtitle: "text-lg font-semibold leading-snug",
  body: "text-base leading-normal",
  "body-strong": "text-base font-semibold leading-normal",
  caption: "text-sm leading-snug",
  label: "text-xs font-medium uppercase tracking-wider",
  metric: "text-2xl font-bold leading-tight tabular-nums",
};

export const textTones: Record<TextTone, string> = {
  primary: "text-fg-primary",
  secondary: "text-fg-secondary",
  muted: "text-fg-muted",
  danger: "text-accent-danger",
  success: "text-accent-success",
  warning: "text-accent-warning",
};
