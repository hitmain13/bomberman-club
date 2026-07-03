export const styles = {
  root: "flex flex-col gap-4",
  section: "flex flex-col gap-1",
  label: "text-xs uppercase tracking-wider text-fg-muted",
  value: "text-sm text-fg-primary",
  empty: "text-sm text-fg-muted",
  list: "flex flex-col divide-y divide-border-subtle overflow-hidden rounded-lg border border-border-subtle bg-bg-surface",
  row: "flex items-center justify-between px-4 py-3",
  rowLabel: "text-sm text-fg-secondary",
  rowValue: "text-sm font-semibold tabular-nums text-fg-primary",
} as const;
