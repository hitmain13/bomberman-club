export const styles = {
  root: "fixed inset-x-0 bottom-0 z-bottom-nav border-t border-border-subtle bg-bg-surface/95 backdrop-blur pb-[max(env(safe-area-inset-bottom),0px)]",
  list: "mx-auto flex h-16 max-w-md items-center justify-around px-2",
  item: "flex flex-col items-center gap-1 text-xs text-fg-muted transition-colors",
  itemActive: "text-fg-primary",
  emphasized:
    "flex h-12 w-12 items-center justify-center rounded-full bg-fg-primary text-fg-inverted shadow-md -mt-6",
} as const;
