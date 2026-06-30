import { createHash, createHmac } from "node:crypto";

import { env } from "@/config/env";

const SERVICE = "s3";

function hmac(key: Buffer | string, data: string): Buffer {
  return createHmac("sha256", key).update(data, "utf8").digest();
}

function sha256Hex(data: Buffer | Uint8Array | string): string {
  return createHash("sha256").update(data).digest("hex");
}

function awsDate(now: Date): { amzDate: string; dateStamp: string } {
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  return { amzDate, dateStamp: amzDate.slice(0, 8) };
}

function signingKey(dateStamp: string): Buffer {
  const kDate = hmac(`AWS4${env.S3_SECRET_ACCESS_KEY}`, dateStamp);
  const kRegion = hmac(kDate, env.S3_REGION);
  const kService = hmac(kRegion, SERVICE);
  return hmac(kService, "aws4_request");
}

export interface PutObjectResult {
  url: string;
  bucketKey: string;
}

export async function putObject(
  bucketKey: string,
  body: Uint8Array,
  contentType: string,
): Promise<PutObjectResult> {
  const endpoint = env.S3_ENDPOINT.replace(/\/$/, "");
  const host = new URL(endpoint).host;
  const url = `${endpoint}/${env.S3_BUCKET}/${bucketKey}`;
  const now = new Date();
  const { amzDate, dateStamp } = awsDate(now);
  const payloadHash = sha256Hex(body);

  const canonicalHeaders =
    `content-length:${body.byteLength}\n` +
    `content-type:${contentType}\n` +
    `host:${host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;
  const signedHeaders = "content-length;content-type;host;x-amz-content-sha256;x-amz-date";

  const canonicalRequest = [
    "PUT",
    `/${env.S3_BUCKET}/${bucketKey}`,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const credentialScope = `${dateStamp}/${env.S3_REGION}/${SERVICE}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const signature = hmac(signingKey(dateStamp), stringToSign).toString("hex");
  const authorization = `AWS4-HMAC-SHA256 Credential=${env.S3_ACCESS_KEY_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "content-length": String(body.byteLength),
      "content-type": contentType,
      host,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
      authorization,
    },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`S3 PUT failed: ${response.status} ${text}`);
  }

  return {
    url: `${env.S3_PUBLIC_BASE_URL.replace(/\/$/, "")}/${bucketKey}`,
    bucketKey,
  };
}
