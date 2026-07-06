import { createBombermanClient } from "@bomberman/sdk";

let accessToken: string | null = null;
let onUnauthorizedCallback: (() => void) | null = null;
let refreshAccessTokenFn: (() => Promise<string | null>) | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function onUnauthorized(callback: () => void): void {
  onUnauthorizedCallback = callback;
}

export function setRefreshAccessToken(fn: () => Promise<string | null>): void {
  refreshAccessTokenFn = fn;
}

const configuredBaseUrl =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:3333";

// No browser, prefere o proxy same-origin /api para cookies first-party.
// No server/SSR mantem URL absoluta.
const baseUrl =
  typeof window !== "undefined" && !configuredBaseUrl.startsWith("/") ? "/api" : configuredBaseUrl;

export const apiClient = createBombermanClient({
  baseUrl,
  getAccessToken: () => accessToken,
  onUnauthorized: () => onUnauthorizedCallback?.(),
  refreshAccessToken: async () => refreshAccessTokenFn?.() ?? null,
});
