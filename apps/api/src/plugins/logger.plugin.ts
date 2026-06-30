import { Elysia } from "elysia";

import { logger } from "@/config/logger";

export const loggerPlugin = new Elysia({ name: "logger" })
  .decorate("logger", logger)
  .onRequest(({ request }) => {
    logger.debug({ method: request.method, url: request.url }, "request_start");
  });
