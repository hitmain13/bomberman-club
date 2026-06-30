import { describe, expect, it } from "vitest";

describe("CommentsThread", () => {
  it("is exported as a named function", async () => {
    const module = await import("./CommentsThread");
    expect(typeof module.CommentsThread).toBe("function");
  });
});
