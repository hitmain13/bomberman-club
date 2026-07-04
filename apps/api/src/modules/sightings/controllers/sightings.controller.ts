import {
  sightingInputSchema,
  sightingListQuerySchema,
  sightingUpdateSchema,
} from "@bomberman/types";
import { Elysia } from "elysia";

import { parseOrThrow } from "@/common/validation";
import { authPlugin, requireAuth } from "@/plugins/auth.plugin";

import { sightingsService } from "../services/sightings.service";

export const sightingsController = new Elysia({ prefix: "/sightings" })
  .use(authPlugin)
  .get("/", ({ query, currentUser }) => {
    const params = parseOrThrow(sightingListQuerySchema, query);
    return sightingsService.list(
      {
        period: params.period ?? "ALL",
        cursor: params.cursor ?? null,
        limit: params.limit,
      },
      currentUser?.id ?? null,
    );
  })
  .get("/:id", ({ params, currentUser }) =>
    sightingsService.get(params.id, currentUser?.id ?? null),
  )
  .post("/", ({ currentUser, body }) => {
    const user = requireAuth(currentUser);
    const input = parseOrThrow(sightingInputSchema, body);
    return sightingsService.create(user.id, input);
  })
  .patch("/:id", ({ currentUser, params, body }) => {
    const user = requireAuth(currentUser);
    const input = parseOrThrow(sightingUpdateSchema, body);
    return sightingsService.update(params.id, user, input);
  })
  .delete("/:id", async ({ currentUser, params }) => {
    const user = requireAuth(currentUser);
    await sightingsService.remove(params.id, user);
    return { ok: true };
  });

export const userSightingsController = new Elysia({ prefix: "/users" })
  .use(authPlugin)
  .get("/:username/sightings", ({ params, currentUser }) =>
    sightingsService.listByUsername(params.username, currentUser?.id ?? null),
  );
