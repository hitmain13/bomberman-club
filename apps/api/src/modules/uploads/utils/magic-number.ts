export type SupportedMime = "image/jpeg" | "image/png" | "image/webp";

interface Signature {
  mime: SupportedMime;
  bytes: ReadonlyArray<number>;
  offset?: number;
}

const SIGNATURES: ReadonlyArray<Signature> = [
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mime: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] },
];

export function detectMimeFromBytes(buffer: Uint8Array): SupportedMime | null {
  for (const sig of SIGNATURES) {
    const offset = sig.offset ?? 0;
    if (buffer.length < offset + sig.bytes.length) {
      continue;
    }
    let ok = true;
    for (let i = 0; i < sig.bytes.length; i += 1) {
      if (buffer[offset + i] !== sig.bytes[i]) {
        ok = false;
        break;
      }
    }
    if (ok) {
      if (sig.mime === "image/webp") {
        const tag = String.fromCharCode(
          buffer[8] ?? 0,
          buffer[9] ?? 0,
          buffer[10] ?? 0,
          buffer[11] ?? 0,
        );
        if (tag !== "WEBP") {
          continue;
        }
      }
      return sig.mime;
    }
  }
  return null;
}
