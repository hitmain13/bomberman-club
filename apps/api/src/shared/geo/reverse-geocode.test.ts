import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resetCacheStoreForTests } from "@/shared/cache/create-cache";

import {
  getReverseGeocodeService,
  resetGeocodeMetricsForTests,
  resetReverseGeocodeServiceForTests,
} from "./reverse-geocode";

describe("getReverseGeocodeService", () => {
  beforeEach(() => {
    resetCacheStoreForTests();
    resetReverseGeocodeServiceForTests();
    resetGeocodeMetricsForTests();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns street from Nominatim and caches subsequent lookups", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        address: { road: "Rua Lira", suburb: "Vila Madalena" },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const service = getReverseGeocodeService();
    const first = await service.resolve(-23.55291, -46.69646);
    const second = await service.resolve(-23.552913, -46.696462);

    expect(first).toBe("Rua Lira, Vila Madalena");
    expect(second).toBe("Rua Lira, Vila Madalena");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const metrics = service.getMetrics();
    expect(metrics.cacheHits).toBe(1);
    expect(metrics.cacheMisses).toBe(1);
    expect(metrics.externalRequests).toBe(1);
  });

  it("retries on transient failures", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 503 })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ address: { road: "Rua Augusta" } }),
      });
    vi.stubGlobal("fetch", fetchMock);

    const service = getReverseGeocodeService();
    const street = await service.resolve(-23.55, -46.65);

    expect(street).toBe("Rua Augusta");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(service.getMetrics().externalErrors).toBe(1);
  });
});
