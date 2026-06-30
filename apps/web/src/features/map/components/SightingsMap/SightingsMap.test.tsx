import { describe, expect, it } from "vitest";

describe("SightingsMap", () => {
  it("is exported as a named component", async () => {
    const module = await import("./SightingsMap");
    expect(typeof module.SightingsMap).toBe("function");
  });
});
