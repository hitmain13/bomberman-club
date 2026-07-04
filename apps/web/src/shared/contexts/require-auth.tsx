"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { StatePanel } from "@/components/organisms/StatePanel";

import { useAuth } from "./auth-context";

export function RequireAuth({ children }: { children: React.ReactNode }): JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirect = encodeURIComponent(pathname);
      router.replace(`/login?redirect=${redirect}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading || !isAuthenticated) {
    return <StatePanel kind="loading" />;
  }
  return <>{children}</>;
}
