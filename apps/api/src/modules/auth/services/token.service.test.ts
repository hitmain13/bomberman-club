import { describe, expect, it } from "vitest";

import {
  hashRefreshToken,
  issueAccessToken,
  issueRefreshToken,
  verifyAccessToken,
} from "./token.service";

describe("token.service", () => {
  it("issues and verifies an access token", async () => {
    const issued = await issueAccessToken({ sub: "user-1", username: "speed.fabio", role: "USER" });
    expect(issued.token).toBeTypeOf("string");
    expect(issued.expiresIn).toBeGreaterThan(0);

    const payload = await verifyAccessToken(issued.token);
    expect(payload.sub).toBe("user-1");
    expect(payload.username).toBe("speed.fabio");
    expect(payload.role).toBe("USER");
  });

  it("rejects a tampered access token", async () => {
    const issued = await issueAccessToken({ sub: "user-1", username: "speed.fabio", role: "USER" });
    await expect(verifyAccessToken(`${issued.token}.tampered`)).rejects.toThrow();
  });

  it("hashes refresh tokens deterministically", () => {
    const token = "abc";
    expect(hashRefreshToken(token)).toBe(hashRefreshToken(token));
  });

  it("issues unique refresh tokens", () => {
    const a = issueRefreshToken();
    const b = issueRefreshToken();
    expect(a.token).not.toBe(b.token);
    expect(a.tokenHash).not.toBe(b.tokenHash);
    expect(a.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });
});
