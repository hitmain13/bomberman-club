import type { ButtonSize, ButtonVariant } from "./Button.types";

export const buttonBase =
  "inline-flex items-center justify-center gap-2 font-medium rounded-pill transition-colors disabled:opacity-50 disabled:pointer-events-none select-none";

export const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-fg-primary text-fg-inverted hover:bg-fg-secondary active:bg-fg-secondary",
  secondary:
    "bg-bg-elevated text-fg-primary border border-border-default hover:bg-bg-muted active:bg-bg-muted",
  ghost: "bg-transparent text-fg-primary hover:bg-bg-elevated active:bg-bg-muted",
  danger: "bg-accent-danger text-fg-primary hover:opacity-90 active:opacity-90",
};

export const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-base",
  lg: "h-12 px-6 text-base",
};
