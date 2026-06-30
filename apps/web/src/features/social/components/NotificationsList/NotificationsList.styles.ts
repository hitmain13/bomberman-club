export const styles = {
  root: "flex flex-col divide-y divide-border-subtle overflow-hidden rounded-lg border border-border-subtle bg-bg-surface",
  item: "flex items-center gap-3 px-4 py-3",
  itemUnread: "bg-bg-elevated",
  text: "flex-1 text-sm text-fg-primary",
  meta: "text-xs text-fg-muted",
  dot: "h-2 w-2 rounded-full bg-accent-info",
} as const;
