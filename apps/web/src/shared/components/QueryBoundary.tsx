import type { ReactNode } from "react";

import { StatePanel } from "@/components/organisms/StatePanel";

interface QueryState {
  isPending: boolean;
  isError: boolean;
  data: unknown;
  error?: unknown;
}

interface QueryBoundaryProps {
  query: QueryState;
  skeleton?: ReactNode;
  empty?: ReactNode;
  errorDescription?: string;
  children: ReactNode;
}

function isEmptyData(data: unknown): boolean {
  if (data === null || data === undefined) {
    return true;
  }
  if (Array.isArray(data)) {
    return data.length === 0;
  }
  if (
    typeof data === "object" &&
    "data" in data &&
    Array.isArray((data as { data: unknown[] }).data)
  ) {
    return (data as { data: unknown[] }).data.length === 0;
  }
  return false;
}

export function QueryBoundary({
  query,
  skeleton,
  empty,
  errorDescription,
  children,
}: QueryBoundaryProps): JSX.Element {
  const isInitialLoading = query.isPending && query.data === undefined;

  if (isInitialLoading) {
    return <>{skeleton ?? <StatePanel kind="loading" />}</>;
  }
  if (query.isError) {
    return (
      <StatePanel kind="error" {...(errorDescription ? { description: errorDescription } : {})} />
    );
  }
  if (isEmptyData(query.data)) {
    return empty ? <>{empty}</> : <StatePanel kind="empty" />;
  }
  return <>{children}</>;
}
