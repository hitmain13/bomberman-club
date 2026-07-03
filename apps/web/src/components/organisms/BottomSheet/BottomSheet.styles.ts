export const styles = {
  overlay: "fixed inset-0 z-overlay bg-bg-base/80 backdrop-blur-sm",
  sheet:
    "fixed inset-x-0 bottom-0 z-modal flex max-h-[90dvh] flex-col gap-3 rounded-t-xl border-t border-border-default bg-bg-surface p-4 shadow-lg",
  header: "flex items-center justify-between",
  title: "text-base font-semibold",
  close: "text-sm text-fg-secondary hover:text-fg-primary",
  body: "flex flex-col gap-3 overflow-y-auto",
  footer: "flex gap-2",
} as const;
