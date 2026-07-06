import { env } from "@/config/env";
import { logger } from "@/config/logger";
import { createCacheStore } from "@/shared/cache/create-cache";

import {
  getGeocodeMetrics,
  recordGeocodeCacheHit,
  recordGeocodeCacheMiss,
  recordGeocodeExternalError,
  recordGeocodeExternalRequest,
  recordGeocodeThrottledWait,
} from "./metrics";

const CACHE_TTL_SECONDS = 60 * 60 * 24 * 30;
const MIN_INTERVAL_MS = 1_100;
const MAX_RETRIES = 2;
const NOMINATIM_USER_AGENT = "BombermanClub/1.0 (contact@bombermanclub.app)";

let lastExternalRequestAt = 0;
let throttleChain: Promise<void> = Promise.resolve();

interface NominatimSearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export interface GeoSearchResult {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
}

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

function cacheKey(query: string): string {
  return `geo:search:${query.trim().toLowerCase().slice(0, 120)}`;
}

async function fetchNominatimSearch(query: string): Promise<GeoSearchResult[]> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("q", query);
  url.searchParams.set("addressdetails", "0");
  url.searchParams.set("limit", "5");

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": NOMINATIM_USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`Nominatim HTTP ${response.status}`);
  }

  const data = (await response.json()) as NominatimSearchResult[];
  return data.map((item) => ({
    id: `place_${item.place_id}`,
    label: item.display_name,
    latitude: Number.parseFloat(item.lat),
    longitude: Number.parseFloat(item.lon),
  }));
}

async function fetchWithRetry(query: string): Promise<GeoSearchResult[]> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      await waitForThrottle();
      recordGeocodeExternalRequest();
      return await fetchNominatimSearch(query);
    } catch (error) {
      lastError = error;
      recordGeocodeExternalError();
      if (attempt === MAX_RETRIES) {
        break;
      }
      const backoffMs = 1_000 * 2 ** attempt;
      logger.warn({ err: error, attempt, query, backoffMs }, "geo_search_retry");
      await sleep(backoffMs);
    }
  }
  logger.error({ err: lastError, query }, "geo_search_failed");
  return [];
}

class GeoSearchService {
  private readonly cache = createCacheStore();

  async search(query: string): Promise<GeoSearchResult[]> {
    if (!query || query.trim().length < 3) {
      return [];
    }
    const key = cacheKey(query);
    const cached = await this.cache.get(key);
    if (cached) {
      recordGeocodeCacheHit();
      try {
        return JSON.parse(cached) as GeoSearchResult[];
      } catch {
        // ignore cache parse errors and fall through
      }
    }
    recordGeocodeCacheMiss();
    const results = await enqueueThrottled(() => fetchWithRetry(query));
    if (results.length > 0) {
      await this.cache.set(key, JSON.stringify(results), CACHE_TTL_SECONDS);
    }
    if (env.NODE_ENV !== "test") {
      logger.debug(
        { query, resultsCount: results.length, metrics: getGeocodeMetrics() },
        "geo_search_resolved",
      );
    }
    return results;
  }
}

let geoSearchService: GeoSearchService | null = null;

export function getGeoSearchService(): GeoSearchService {
  geoSearchService ??= new GeoSearchService();
  return geoSearchService;
}

export function resetGeoSearchServiceForTests(): void {
  geoSearchService = null;
  lastExternalRequestAt = 0;
  throttleChain = Promise.resolve();
}
