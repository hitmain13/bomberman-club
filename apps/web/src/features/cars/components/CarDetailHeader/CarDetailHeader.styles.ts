export const styles = {
  root: "flex flex-col gap-3",
  cover: "relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-bg-elevated",
  placeholder:
    "flex h-full w-full items-center justify-center text-xs uppercase tracking-wider text-fg-muted",
  badges: "absolute left-3 top-3 flex gap-2",
  identity: "flex items-start justify-between gap-3",
  title: "flex flex-col gap-1",
  nickname: "text-xl font-bold tracking-tight",
  subtitle: "text-sm text-fg-secondary",
  meta: "text-xs uppercase tracking-wider text-fg-muted",
} as const;
