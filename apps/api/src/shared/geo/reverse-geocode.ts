import { env } from "@/config/env";
import { logger } from "@/config/logger";
import { createCacheStore } from "@/shared/cache/create-cache";

import { geoCacheKey, roundCoordinates } from "./coordinate";
import {
  getGeocodeMetrics,
  recordGeocodeCacheHit,
  recordGeocodeCacheMiss,
  recordGeocodeExternalError,
  recordGeocodeExternalRequest,
  recordGeocodeThrottledWait,
} from "./metrics";
import { fetchNominatimReverse } from "./nominatim";

const CACHE_TTL_SECONDS = 60 * 60 * 24 * 30;
const MIN_INTERVAL_MS = 1_100;
const MAX_RETRIES = 3;
const NOMINATIM_USER_AGENT = "BombermanClub/1.0 (contact@bombermanclub.app)";

let lastExternalRequestAt = 0;
let throttleChain: Promise<void> = Promise.resolve();

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function waitForThrottle(): Promise<void> {
  const now = Date.now();
  const waitMs = Math.max(0, MIN_INTERVAL_MS - (now - lastExternalRequestAt));
  if (waitMs > 0) {
    recordGeocodeThrottledWait();
    await sleep(waitMs);
  }
  lastExternalRequestAt = Date.now();
}

function enqueueThrottled<T>(task: () => Promise<T>): Promise<T> {
  const run = throttleChain.then(task);
  throttleChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function fetchWithRetry(latitude: number, longitude: number): Promise<string | null> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      await waitForThrottle();
      recordGeocodeExternalRequest();
      return await fetchNominatimReverse({
        latitude,
        longitude,
        userAgent: NOMINATIM_USER_AGENT,
      });
    } catch (error) {
      lastError = error;
      recordGeocodeExternalError();
      if (attempt === MAX_RETRIES) {
        break;
      }
      const backoffMs = 1_000 * 2 ** attempt;
      logger.warn({ err: error, attempt, latitude, longitude, backoffMs }, "geocode_retry");
      await sleep(backoffMs);
    }
  }
  logger.error({ err: lastError, latitude, longitude }, "geocode_failed");
  return null;
}

export interface ReverseGeocodeService {
  resolve(latitude: number, longitude: number): Promise<string | null>;
  getMetrics(): ReturnType<typeof getGeocodeMetrics>;
}

class ReverseGeocodeServiceImpl implements ReverseGeocodeService {
  private readonly cache = createCacheStore();

  async resolve(latitude: number, longitude: number): Promise<string | null> {
    const rounded = roundCoordinates(latitude, longitude);
    const cacheKey = geoCacheKey(rounded.latitude, rounded.longitude);

    const cached = await this.cache.get(cacheKey);
    if (cached) {
      recordGeocodeCacheHit();
      return cached;
    }

    recordGeocodeCacheMiss();
    const street = await enqueueThrottled(() =>
      fetchWithRetry(rounded.latitude, rounded.longitude),
    );

    if (street) {
      await this.cache.set(cacheKey, street, CACHE_TTL_SECONDS);
    }

    if (env.NODE_ENV !== "test") {
      logger.debug({ cacheKey, street, metrics: getGeocodeMetrics() }, "geocode_resolved");
    }

    return street;
  }

  getMetrics(): ReturnType<typeof getGeocodeMetrics> {
    return getGeocodeMetrics();
  }
}

let reverseGeocodeService: ReverseGeocodeService | null = null;

export function getReverseGeocodeService(): ReverseGeocodeService {
  reverseGeocodeService ??= new ReverseGeocodeServiceImpl();
  return reverseGeocodeService;
}

/** Resets singleton — for tests only. */
export function resetReverseGeocodeServiceForTests(): void {
  reverseGeocodeService = null;
  lastExternalRequestAt = 0;
  throttleChain = Promise.resolve();
}

export { geoCacheKey, roundCoordinates } from "./coordinate";
export { getGeocodeMetrics, resetGeocodeMetricsForTests } from "./metrics";
