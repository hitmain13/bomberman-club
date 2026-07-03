export const styles = {
  root: "mt-6 grid overflow-hidden rounded-lg border border-border-subtle bg-bg-surface",
  item: "flex flex-col items-center justify-center gap-1 px-4 py-4 border-r border-border-subtle last:border-r-0",
  value: "text-lg font-bold tabular-nums text-fg-primary",
  label: "text-xs uppercase tracking-wider text-fg-muted",
} as const;

const columnsByCount: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

export function gridColumnsClassName(itemCount: number): string {
  const clamped = Math.min(Math.max(itemCount, 1), 4);
  return columnsByCount[clamped] ?? "grid-cols-3";
}
