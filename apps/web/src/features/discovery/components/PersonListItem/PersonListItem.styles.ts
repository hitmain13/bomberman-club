export const styles = {
  root: "flex items-center gap-3 rounded-md border border-border-subtle bg-bg-surface px-4 py-3",
  identity: "flex min-w-0 flex-1 items-center gap-3",
  info: "flex min-w-0 flex-col",
  username: "truncate text-sm font-semibold text-fg-primary",
  city: "truncate text-xs text-fg-muted",
  meta: "flex shrink-0 items-center gap-1 text-xs text-fg-muted",
  metaDivider: "text-border-strong",
  action: "shrink-0",
} as const;
