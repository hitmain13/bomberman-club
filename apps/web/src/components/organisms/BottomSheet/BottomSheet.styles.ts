import { cn } from "@/shared/utils/cn";

export const styles = {
  overlay: "fixed inset-0 z-overlay bg-bg-base/80 backdrop-blur-sm",
  sheet:
    "fixed bottom-0 z-modal flex max-h-[90dvh] flex-col gap-3 rounded-t-xl border-t border-border-default bg-bg-surface p-4 shadow-lg",
  sheetConstrained: "left-1/2 w-full max-w-md -translate-x-1/2",
  sheetFullWidth: "inset-x-0",
  header: "flex items-center justify-between",
  title: "text-sm font-medium text-fg-secondary",
  close: "text-sm text-fg-secondary hover:text-fg-primary",
  body: "flex flex-col gap-3 overflow-y-auto",
  footer: "flex gap-2",
} as const;

export function sheetClassName(constrained: boolean): string {
  return cn(styles.sheet, constrained ? styles.sheetConstrained : styles.sheetFullWidth);
}
