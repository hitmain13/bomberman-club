export const styles = {
  root: "flex flex-col gap-6",
  section: "flex flex-col gap-3",
  sectionTitle: "text-xs uppercase tracking-wider text-fg-muted",
  grid: "grid grid-cols-2 gap-3",
  photoBox:
    "relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-border-default bg-bg-surface text-fg-muted",
  photoInput: "absolute inset-0 cursor-pointer opacity-0",
  hint: "text-xs text-fg-muted",
  error:
    "rounded-md border border-accent-danger/30 bg-accent-danger/10 px-3 py-2 text-sm text-accent-danger",
} as const;
