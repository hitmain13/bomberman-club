export const styles = {
  root: "group block overflow-hidden rounded-lg border border-border-subtle bg-bg-surface transition-colors hover:border-border-default",
  cover: "relative aspect-[16/9] w-full bg-bg-elevated",
  coverPlaceholder:
    "flex h-full w-full items-center justify-center text-xs uppercase tracking-wider text-fg-muted",
  badge: "absolute left-3 top-3",
  body: "flex flex-col gap-3 p-4",
  header: "flex items-start justify-between gap-2",
  identity: "flex flex-col gap-0.5",
  nickname: "text-base font-semibold leading-tight",
  subtitle: "text-xs text-fg-muted",
  metrics: "grid grid-cols-3 gap-3",
  owner: "flex items-center gap-2 border-t border-border-subtle px-4 py-2.5",
  ownerAvatar: "h-5 w-5",
  ownerUsername: "text-xs font-medium text-fg-secondary",
} as const;
