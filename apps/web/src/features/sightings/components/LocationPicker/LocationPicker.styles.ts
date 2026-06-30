export const styles = {
  overlay: "fixed inset-0 z-overlay bg-bg-base/80 backdrop-blur-sm",
  sheet:
    "fixed inset-x-0 bottom-0 z-modal flex max-h-[90dvh] flex-col gap-3 rounded-t-xl border-t border-border-default bg-bg-surface p-4 shadow-lg",
  header: "flex items-center justify-between",
  title: "text-base font-semibold",
  close: "text-sm text-fg-secondary hover:text-fg-primary",
  mapWrap:
    "relative h-[60dvh] w-full overflow-hidden rounded-lg border border-border-subtle bg-bg-elevated",
  hint: "flex items-center justify-between gap-3 text-xs text-fg-muted tabular-nums",
  hintCoord: "font-medium text-fg-secondary",
  actions: "flex gap-2",
  pickerMarker:
    "h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-bg-base bg-accent-primary shadow-md",
  meMarker:
    "h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bg-base bg-accent-info shadow-sm",
} as const;
