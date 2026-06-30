export const styles = {
  root: "flex flex-col gap-4",
  error:
    "rounded-md border border-accent-danger/30 bg-accent-danger/10 px-3 py-2 text-sm text-accent-danger",
  terms: "flex items-start gap-2 text-sm text-fg-secondary",
  termsCheckbox:
    "mt-0.5 h-4 w-4 rounded border-border-default bg-bg-elevated text-fg-primary focus:ring-fg-primary",
  termsError: "text-xs text-accent-danger",
} as const;
