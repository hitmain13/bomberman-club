"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { StatePanel } from "@/components/organisms/StatePanel";

import { useAuth } from "./auth-context";

export function RequireAuth({ children }: { children: React.ReactNode }): JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return <StatePanel kind="loading" />;
  }
  return <>{children}</>;
}
