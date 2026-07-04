import { env } from "@/config/env";

import type { CacheStore } from "./cache.interface";
import { MemoryCacheStore } from "./memory-cache";
import { RedisCacheStore } from "./redis-cache";

let cacheStore: CacheStore | null = null;

export function createCacheStore(): CacheStore {
  if (cacheStore) {
    return cacheStore;
  }
  cacheStore = env.REDIS_URL ? new RedisCacheStore(env.REDIS_URL) : new MemoryCacheStore();
  return cacheStore;
}

/** Resets singleton — for tests only. */
export function resetCacheStoreForTests(): void {
  cacheStore = null;
}
