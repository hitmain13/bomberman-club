import { createBombermanClient } from "@bomberman/sdk";

let accessToken: string | null = null;
let onUnauthorizedCallback: (() => void) | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function onUnauthorized(callback: () => void): void {
  onUnauthorizedCallback = callback;
}

const baseUrl =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:3333";

export const apiClient = createBombermanClient({
  baseUrl,
  getAccessToken: () => accessToken,
  onUnauthorized: () => onUnauthorizedCallback?.(),
});
