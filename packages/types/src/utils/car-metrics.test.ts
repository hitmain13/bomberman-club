import { describe, expect, it } from "vitest";

import { calculateCarMetrics, horsepowerToKw } from "./car-metrics";

describe("calculateCarMetrics", () => {
  it("calculates ratios for typical GTI Mk7", () => {
    const result = calculateCarMetrics({
      weightKg: 1320,
      horsepowerHp: 320,
      torqueNm: 420,
    });

    expect(result.weightToPowerKgPerHp).toBe(4.13);
    expect(result.powerToWeightHpPerTon).toBe(242.4);
    expect(result.torqueToWeightNmPerTon).toBe(318.2);
  });

  it("returns zeroes on invalid input", () => {
    const result = calculateCarMetrics({ weightKg: 0, horsepowerHp: 0, torqueNm: 0 });
    expect(result.weightToPowerKgPerHp).toBe(0);
  });
});

describe("horsepowerToKw", () => {
  it("converts hp to kw", () => {
    expect(horsepowerToKw(100)).toBe(74.6);
  });
});
