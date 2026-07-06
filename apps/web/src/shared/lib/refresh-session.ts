import { ApiError } from "@bomberman/sdk";
import type { AuthResponse } from "@bomberman/types";

import { apiClient } from "@/shared/lib/api-client";

const RETRY_DELAYS_MS = [0, 500, 1_500] as const;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

let refreshInFlight: Promise<AuthResponse | null> | null = null;

function isRetryableError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status !== 401;
  }
  return true;
}

async function attemptRefresh(signal?: AbortSignal): Promise<AuthResponse | null> {
  if (signal?.aborted) {
    return null;
  }
  try {
    return await apiClient.auth.refresh();
  } catch (error) {
    if (signal?.aborted) {
      return null;
    }
    if (!isRetryableError(error)) {
      throw error;
    }
    return null;
  }
}

export function refreshSession(signal?: AbortSignal): Promise<AuthResponse | null> {
  refreshInFlight ??= attemptRefresh(signal).finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

export async function refreshSessionWithRetry(signal?: AbortSignal): Promise<AuthResponse | null> {
  for (const delay of RETRY_DELAYS_MS) {
    if (signal?.aborted) {
      return null;
    }
    if (delay > 0) {
      await sleep(delay);
    }
    try {
      const session = await refreshSession(signal);
      if (session) {
        return session;
      }
    } catch (error) {
      if (!isRetryableError(error)) {
        return null;
      }
    }
  }
  return null;
}
