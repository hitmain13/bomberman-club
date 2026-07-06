"use client";

import { useEffect } from "react";

import { useAuth } from "@/shared/contexts/auth-context";

const HEARTBEAT_MS = 10 * 60 * 1000;

export function ApiHeartbeat(): null {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const baseUrl =
      typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
        ? process.env.NEXT_PUBLIC_API_URL
        : "http://localhost:3333";

    const ping = (): void => {
      void fetch(`${baseUrl.replace(/\/$/, "")}/health`, {
        method: "GET",
        credentials: "omit",
        cache: "no-store",
      }).catch(() => undefined);
    };

    ping();
    const timer = window.setInterval(ping, HEARTBEAT_MS);
    return () => window.clearInterval(timer);
  }, [isAuthenticated]);

  return null;
}
