export const styles = {
  group: "flex flex-col gap-3",
  category: "text-xs uppercase tracking-wider text-fg-muted",
  list: "flex flex-col gap-2",
  item: "flex items-center justify-between gap-3 rounded-md border border-border-subtle bg-bg-surface px-4 py-3",
  identity: "flex flex-col",
  manufacturer: "text-sm font-semibold text-fg-primary",
  partName: "text-xs text-fg-muted",
  remove:
    "rounded-pill border border-border-default px-3 py-1 text-xs text-fg-secondary hover:bg-bg-elevated",
} as const;
