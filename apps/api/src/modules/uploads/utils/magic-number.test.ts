import { describe, expect, it } from "vitest";

import { detectMimeFromBytes } from "./magic-number";

describe("detectMimeFromBytes", () => {
  it("detects jpeg", () => {
    const buffer = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
    expect(detectMimeFromBytes(buffer)).toBe("image/jpeg");
  });

  it("detects png", () => {
    const buffer = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
    expect(detectMimeFromBytes(buffer)).toBe("image/png");
  });

  it("rejects unsupported", () => {
    const buffer = new Uint8Array([0x00, 0x01, 0x02, 0x03]);
    expect(detectMimeFromBytes(buffer)).toBe(null);
  });
});
