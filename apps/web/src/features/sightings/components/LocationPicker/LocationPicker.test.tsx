import { describe, expect, it } from "vitest";

describe("LocationPicker", () => {
  it("is exported as a named function", async () => {
    const module = await import("./LocationPicker");
    expect(typeof module.LocationPicker).toBe("function");
  });
});
