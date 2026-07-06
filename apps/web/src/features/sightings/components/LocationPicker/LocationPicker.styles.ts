export const styles = {
  mapWrap:
    "relative h-[60dvh] w-full overflow-hidden rounded-lg border border-border-subtle bg-bg-elevated",
  hint: "flex items-center justify-between gap-3 text-xs text-fg-muted",
  hintAddress: "max-w-[60%] truncate text-right font-medium text-fg-secondary",
  pickerMarker:
    "h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-bg-base bg-accent-primary shadow-md",
  meMarker:
    "h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bg-base bg-accent-info shadow-sm",
} as const;
