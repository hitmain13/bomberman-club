export const styles = {
  root: "flex flex-col gap-3 rounded-lg border border-border-subtle bg-bg-surface p-4",
  label: "text-sm font-medium text-fg-secondary",
  grid: "grid grid-cols-2 gap-3",
  select:
    "h-12 w-full rounded-md border border-border-default bg-bg-elevated px-3 text-base text-fg-primary disabled:opacity-50",
  hint: "text-xs text-fg-muted",
  error: "text-xs text-accent-danger",
} as const;
