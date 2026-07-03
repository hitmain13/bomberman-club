export const styles = {
  root: "flex flex-col gap-3",
  title: "text-xs uppercase tracking-wider text-fg-muted",
  rail: "flex gap-4 overflow-x-auto no-scrollbar",
  item: "flex w-20 shrink-0 flex-col items-center gap-2 text-center",
  username: "w-full truncate text-xs text-fg-secondary",
  city: "w-full truncate text-[10px] text-fg-muted",
} as const;
