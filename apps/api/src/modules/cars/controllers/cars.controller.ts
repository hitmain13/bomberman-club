import { carInputSchema } from "@bomberman/types";
import { Elysia } from "elysia";

import { parseOrThrow } from "@/common/validation";
import { authPlugin, requireAuth } from "@/plugins/auth.plugin";

import { carsService } from "../services/cars.service";

export const carsController = new Elysia({ prefix: "/cars" })
  .use(authPlugin)
  .get("/mine", ({ currentUser }) => {
    const user = requireAuth(currentUser);
    return carsService.listMine(user.id);
  })
  .get("/:id", ({ params }) => carsService.getById(params.id))
  .post("/", ({ currentUser, body }) => {
    const user = requireAuth(currentUser);
    const input = parseOrThrow(carInputSchema, body);
    return carsService.create(user.id, input);
  })
  .patch("/:id", ({ currentUser, params, body }) => {
    const user = requireAuth(currentUser);
    const input = parseOrThrow(carInputSchema, body);
    return carsService.update(user.id, params.id, input);
  })
  .delete("/:id", async ({ currentUser, params }) => {
    const user = requireAuth(currentUser);
    await carsService.remove(user.id, params.id);
    return { ok: true };
  });

export const userCarsController = new Elysia({ prefix: "/users" }).get(
  "/:username/cars",
  ({ params }) => carsService.listByUsername(params.username),
);
