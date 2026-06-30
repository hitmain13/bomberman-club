import { createHash, randomBytes } from "node:crypto";

import { SignJWT, jwtVerify } from "jose";

import { UnauthorizedError } from "@/common/errors";
import { env } from "@/config/env";

const ACCESS_ALG = "HS256";
const accessSecret = new TextEncoder().encode(env.JWT_ACCESS_SECRET);

export interface AccessTokenPayload {
  sub: string;
  username: string;
}

export interface IssuedAccessToken {
  token: string;
  expiresIn: number;
}

export interface IssuedRefreshToken {
  token: string;
  tokenHash: string;
  expiresAt: Date;
}

export async function issueAccessToken(payload: AccessTokenPayload): Promise<IssuedAccessToken> {
  const expiresIn = env.JWT_ACCESS_TTL_SECONDS;
  const token = await new SignJWT({ username: payload.username })
    .setProtectedHeader({ alg: ACCESS_ALG })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${expiresIn}s`)
    .sign(accessSecret);
  return { token, expiresIn };
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload> {
  try {
    const { payload } = await jwtVerify(token, accessSecret, { algorithms: [ACCESS_ALG] });
    if (typeof payload.sub !== "string" || typeof payload.username !== "string") {
      throw new UnauthorizedError("Invalid token payload");
    }
    return { sub: payload.sub, username: payload.username };
  } catch {
    throw new UnauthorizedError("Invalid or expired access token");
  }
}

export function issueRefreshToken(): IssuedRefreshToken {
  const token = randomBytes(48).toString("base64url");
  const tokenHash = hashRefreshToken(token);
  const expiresAt = new Date(Date.now() + env.JWT_REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);
  return { token, tokenHash, expiresAt };
}

export function hashRefreshToken(token: string): string {
  return createHash("sha256").update(`${env.JWT_REFRESH_SECRET}:${token}`).digest("hex");
}
