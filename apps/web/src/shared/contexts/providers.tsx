"use client";

import { ApiHeartbeat } from "@/shared/components/ApiHeartbeat";
import { MobileInputEnhancements } from "@/shared/components/MobileInputEnhancements";
import { AuthProvider } from "./auth-context";
import { QueryProvider } from "./query-provider";

export function Providers({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <QueryProvider>
      <AuthProvider>
        <ApiHeartbeat />
        <MobileInputEnhancements />
        {children}
      </AuthProvider>
    </QueryProvider>
  );
}
