"use client";

import { MobileInputEnhancements } from "@/shared/components/MobileInputEnhancements";
import { AuthProvider } from "./auth-context";
import { QueryProvider } from "./query-provider";

export function Providers({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <QueryProvider>
      <AuthProvider>
        <MobileInputEnhancements />
        {children}
      </AuthProvider>
    </QueryProvider>
  );
}
