import type { AuthResponse } from "@bomberman/types";

import { apiClient } from "@/shared/lib/api-client";

const RETRY_DELAYS_MS = [0, 2_000, 5_000, 10_000] as const;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

let refreshInFlight: Promise<AuthResponse | null> | null = null;

async function attemptRefresh(): Promise<AuthResponse | null> {
  try {
    return await apiClient.auth.refresh();
  } catch {
    return null;
  }
}

export function refreshSession(): Promise<AuthResponse | null> {
  refreshInFlight ??= attemptRefresh().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

export async function refreshSessionWithRetry(): Promise<AuthResponse | null> {
  for (const delay of RETRY_DELAYS_MS) {
    if (delay > 0) {
      await sleep(delay);
    }
    const session = await refreshSession();
    if (session) {
      return session;
    }
  }
  return null;
}
