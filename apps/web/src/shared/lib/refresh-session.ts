import type { AuthResponse } from "@bomberman/types";

import { apiClient } from "@/shared/lib/api-client";

let refreshInFlight: Promise<AuthResponse | null> | null = null;

export function refreshSession(): Promise<AuthResponse | null> {
  refreshInFlight ??= apiClient.auth
    .refresh()
    .then((session) => session)
    .catch(() => null)
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
}
