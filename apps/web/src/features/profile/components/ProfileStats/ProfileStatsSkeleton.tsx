import { cn } from "@/shared/utils/cn";

interface ProfileStatsSkeletonProps {
  count?: number;
  className?: string;
}

export function ProfileStatsSkeleton({
  count = 4,
  className,
}: ProfileStatsSkeletonProps): JSX.Element {
  const columns = count <= 2 ? "grid-cols-2" : count === 3 ? "grid-cols-3" : "grid-cols-4";
  return (
    <div
      className={cn(
        "grid gap-3 rounded-lg border border-border-subtle bg-bg-surface p-4",
        columns,
        className,
      )}
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => `stat-skeleton-${index}`).map((key) => (
        <div key={key} className="flex flex-col gap-2">
          <div className="h-3 w-16 animate-pulse rounded bg-bg-elevated" />
          <div className="h-6 w-10 animate-pulse rounded bg-bg-elevated" />
        </div>
      ))}
    </div>
  );
}
