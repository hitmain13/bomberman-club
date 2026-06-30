import { Elysia } from "elysia";

import { authController } from "@/modules/auth";
import { carsController, userCarsController } from "@/modules/cars";
import { catalogController } from "@/modules/catalog";
import { garagesController } from "@/modules/garages";
import { sightingsController } from "@/modules/sightings";
import { uploadsController } from "@/modules/uploads";
import { usersController } from "@/modules/users";
import { authPlugin } from "@/plugins/auth.plugin";
import { corsPlugin } from "@/plugins/cors.plugin";
import { errorHandlerPlugin } from "@/plugins/error-handler.plugin";
import { loggerPlugin } from "@/plugins/logger.plugin";
import { securityHeadersPlugin } from "@/plugins/security-headers.plugin";
import { swaggerPlugin } from "@/plugins/swagger.plugin";

export function createApp() {
  return new Elysia()
    .use(errorHandlerPlugin)
    .use(loggerPlugin)
    .use(securityHeadersPlugin)
    .use(corsPlugin)
    .use(swaggerPlugin)
    .use(authPlugin)
    .get("/health", () => ({ ok: true, service: "bomberman-api" }))
    .use(authController)
    .use(usersController)
    .use(garagesController)
    .use(carsController)
    .use(userCarsController)
    .use(catalogController)
    .use(uploadsController)
    .use(sightingsController);
}
