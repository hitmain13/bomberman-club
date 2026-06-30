export const styles = {
  root: "group block overflow-hidden rounded-lg border border-border-subtle bg-bg-surface transition-colors hover:border-border-default",
  cover: "relative aspect-[4/3] w-full bg-bg-elevated",
  body: "flex flex-col gap-2 p-4",
  header: "flex items-center gap-2",
  avatar: "h-7 w-7",
  meta: "flex flex-col text-xs",
  username: "font-semibold text-fg-primary",
  city: "text-fg-muted",
  title: "text-base font-semibold leading-snug text-fg-primary",
  description: "text-sm text-fg-secondary line-clamp-2",
} as const;
