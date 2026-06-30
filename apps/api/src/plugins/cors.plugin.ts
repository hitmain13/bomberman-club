import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

import { env } from "@/config/env";

export const corsPlugin = new Elysia({ name: "cors" }).use(
  cors({
    origin: env.WEB_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Type"],
  }),
);
