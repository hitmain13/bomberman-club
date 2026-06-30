import { createApp } from "@/app";
import { env } from "@/config/env";
import { logger } from "@/config/logger";

const app = createApp();

app.listen(env.PORT, ({ hostname, port }) => {
  logger.info({ hostname, port }, "api_started");
});
