import { Elysia } from "elysia";

import { RateLimitError } from "@/common/errors";

interface Bucket {
  count: number;
  resetAt: number;
}

interface RateLimitOptions {
  windowMs: number;
  max: number;
}

const buckets = new Map<string, Bucket>();

function getKey(prefix: string, ip: string): string {
  return `${prefix}:${ip}`;
}

function getClientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "anonymous"
  );
}

export function rateLimit(prefix: string, options: RateLimitOptions): Elysia {
  return new Elysia({ name: `rate-limit:${prefix}` }).onBeforeHandle(({ request }) => {
    const ip = getClientIp(request);
    const key = getKey(prefix, ip);
    const now = Date.now();
    const existing = buckets.get(key);

    if (!existing || existing.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + options.windowMs });
      return;
    }

    if (existing.count >= options.max) {
      throw new RateLimitError();
    }

    existing.count += 1;
  });
}
