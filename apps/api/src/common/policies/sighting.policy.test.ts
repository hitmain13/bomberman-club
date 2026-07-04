import { describe, expect, it } from "vitest";

import { canManageSighting } from "./sighting.policy";

describe("canManageSighting", () => {
  it("allows owner", () => {
    expect(canManageSighting({ id: "u1", role: "USER" }, "u1")).toBe(true);
  });

  it("allows admin on third-party sighting", () => {
    expect(canManageSighting({ id: "admin", role: "ADMIN" }, "u2")).toBe(true);
  });

  it("denies regular user on third-party sighting", () => {
    expect(canManageSighting({ id: "u1", role: "USER" }, "u2")).toBe(false);
  });
});
