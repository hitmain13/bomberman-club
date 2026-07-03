import { describe, expect, it } from "vitest";

describe("ProfileLikesTab", () => {
  it("is exported as a named function", async () => {
    const module = await import("./ProfileLikesTab");
    expect(typeof module.ProfileLikesTab).toBe("function");
  });
});
