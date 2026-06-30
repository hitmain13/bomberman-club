export const styles = {
  root: "flex flex-col gap-4",
  list: "flex flex-col gap-3",
  item: "flex gap-3",
  body: "flex-1",
  header: "flex items-center justify-between gap-2",
  username: "text-sm font-semibold text-fg-primary",
  date: "text-xs text-fg-muted",
  content: "text-sm leading-snug text-fg-secondary",
  remove: "text-xs text-fg-muted hover:text-accent-danger",
  form: "flex items-center gap-2",
  input:
    "h-11 flex-1 rounded-pill border border-border-default bg-bg-elevated px-4 text-sm text-fg-primary placeholder:text-fg-muted",
  send: "inline-flex h-11 w-11 items-center justify-center rounded-full bg-fg-primary text-fg-inverted disabled:opacity-50",
} as const;
