export interface GeocodeMetricsSnapshot {
  cacheHits: number;
  cacheMisses: number;
  externalRequests: number;
  externalErrors: number;
  throttledWaits: number;
}

const metrics: GeocodeMetricsSnapshot = {
  cacheHits: 0,
  cacheMisses: 0,
  externalRequests: 0,
  externalErrors: 0,
  throttledWaits: 0,
};

export function recordGeocodeCacheHit(): void {
  metrics.cacheHits += 1;
}

export function recordGeocodeCacheMiss(): void {
  metrics.cacheMisses += 1;
}

export function recordGeocodeExternalRequest(): void {
  metrics.externalRequests += 1;
}

export function recordGeocodeExternalError(): void {
  metrics.externalErrors += 1;
}

export function recordGeocodeThrottledWait(): void {
  metrics.throttledWaits += 1;
}

export function getGeocodeMetrics(): GeocodeMetricsSnapshot {
  return { ...metrics };
}

export function resetGeocodeMetricsForTests(): void {
  metrics.cacheHits = 0;
  metrics.cacheMisses = 0;
  metrics.externalRequests = 0;
  metrics.externalErrors = 0;
  metrics.throttledWaits = 0;
}
