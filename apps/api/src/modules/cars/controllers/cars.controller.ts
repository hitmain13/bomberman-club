import { carInputSchema, carPartInputSchema, specValueInputSchema } from "@bomberman/types";
import { Elysia } from "elysia";

import { parseOrThrow } from "@/common/validation";
import { authPlugin, requireAuth } from "@/plugins/auth.plugin";

import { carPartsService } from "../services/car-parts.service";
import { carSpecsService } from "../services/car-specs.service";
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
  })
  .get("/:id/parts", ({ params }) => carPartsService.list(params.id))
  .post("/:id/parts", ({ currentUser, params, body }) => {
    const user = requireAuth(currentUser);
    const input = parseOrThrow(carPartInputSchema, body);
    return carPartsService.add(params.id, user.id, input);
  })
  .delete("/:id/parts/:carPartId", async ({ currentUser, params }) => {
    const user = requireAuth(currentUser);
    await carPartsService.remove(params.id, user.id, params.carPartId);
    return { ok: true };
  })
  .get("/:id/specs", ({ params }) => carSpecsService.list(params.id))
  .put("/:id/specs", ({ currentUser, params, body }) => {
    const user = requireAuth(currentUser);
    const input = parseOrThrow(specValueInputSchema, body);
    return carSpecsService.set(params.id, user.id, input);
  });

export const userCarsController = new Elysia({ prefix: "/users" }).get(
  "/:username/cars",
  ({ params }) => carsService.listByUsername(params.username),
);
