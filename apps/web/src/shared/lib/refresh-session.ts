import { ApiError } from "@bomberman/sdk";
import type { AuthResponse } from "@bomberman/types";

import { apiClient } from "@/shared/lib/api-client";

const RETRY_DELAYS_MS = [0, 500, 1_500, 3_000] as const;
const REFRESH_RETRY_MS = 30_000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

let refreshInFlight: Promise<AuthResponse | null> | null = null;

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status !== 401;
  }
  return true;
}

async function attemptSession(signal?: AbortSignal): Promise<AuthResponse | null> {
  if (signal?.aborted) {
    return null;
  }
  try {
    return await apiClient.auth.session();
  } catch (error) {
    if (signal?.aborted) {
      return null;
    }
    if (isUnauthorizedError(error)) {
      return null;
    }
    if (!isRetryableError(error)) {
      throw error;
    }
    return null;
  }
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
    if (isUnauthorizedError(error)) {
      throw error;
    }
    if (!isRetryableError(error)) {
      throw error;
    }
    return null;
  }
}

export function refreshSession(signal?: AbortSignal): Promise<AuthResponse | null> {
  refreshInFlight ??= resolveSession(signal).finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

async function resolveSession(signal?: AbortSignal): Promise<AuthResponse | null> {
  const active = await attemptSession(signal);
  if (active) {
    return active;
  }
  try {
    return await attemptRefresh(signal);
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return null;
    }
    throw error;
  }
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
      if (isUnauthorizedError(error)) {
        return null;
      }
      if (!isRetryableError(error)) {
        return null;
      }
    }
  }
  return null;
}

export function scheduleBackgroundRefreshRetry(
  callback: () => void,
  delayMs: number = REFRESH_RETRY_MS,
): number {
  return window.setTimeout(callback, delayMs);
}

export { REFRESH_RETRY_MS };
