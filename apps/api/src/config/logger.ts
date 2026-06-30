import pino from "pino";

import { env } from "./env";

export const logger = pino({
  level: env.LOG_LEVEL,
  base: { service: "bomberman-api" },
  redact: {
    paths: ["req.headers.authorization", "req.headers.cookie", "password", "passwordHash"],
    censor: "[redacted]",
  },
});
