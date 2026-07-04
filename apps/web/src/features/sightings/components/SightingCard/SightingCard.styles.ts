export const styles = {
  root: "group block overflow-hidden rounded-lg border border-border-subtle bg-bg-surface transition-colors hover:border-border-default",
  cover: "relative aspect-[4/3] w-full bg-bg-elevated",
  body: "flex flex-col gap-2 p-4",
  header: "flex items-center gap-2",
  avatar: "h-7 w-7 shrink-0",
  meta: "flex min-w-0 flex-col",
  username: "truncate font-semibold text-fg-primary",
  city: "truncate text-fg-muted",
  title: "text-base font-semibold leading-snug text-fg-primary",
  description: "text-sm text-fg-secondary line-clamp-2",
  location: "flex min-w-0 items-center gap-1.5 text-xs text-fg-muted",
  locationIcon: "shrink-0",
} as const;
