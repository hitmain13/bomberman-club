export const styles = {
  root: "flex flex-col gap-4",
  photoBox:
    "relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-border-default bg-bg-surface text-fg-muted",
  photoInput: "absolute inset-0 cursor-pointer opacity-0",
  locationRow: "flex gap-2",
  locationField: "flex-1",
  error:
    "rounded-md border border-accent-danger/30 bg-accent-danger/10 px-3 py-2 text-sm text-accent-danger",
  hint: "text-xs text-fg-muted",
} as const;
