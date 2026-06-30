import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

import { env } from "@/config/env";

function parseOrigins(raw: string): string | string[] {
  const list = raw
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
  if (list.length === 0) {
    return env.WEB_ORIGIN;
  }
  if (list.length === 1) {
    const single = list[0];
    if (single) {
      return single;
    }
  }
  return list;
}

export const corsPlugin = new Elysia({ name: "cors" }).use(
  cors({
    origin: parseOrigins(env.WEB_ORIGIN),
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Type"],
  }),
);
