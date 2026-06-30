"use client";

import { AuthProvider } from "./auth-context";
import { QueryProvider } from "./query-provider";

export function Providers({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
}
