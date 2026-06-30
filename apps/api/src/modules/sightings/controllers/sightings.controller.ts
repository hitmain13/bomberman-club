import { sightingInputSchema, sightingListQuerySchema } from "@bomberman/types";
import { Elysia } from "elysia";

import { parseOrThrow } from "@/common/validation";
import { authPlugin, requireAuth } from "@/plugins/auth.plugin";

import { sightingsService } from "../services/sightings.service";

export const sightingsController = new Elysia({ prefix: "/sightings" })
  .use(authPlugin)
  .get("/", ({ query }) => {
    const params = parseOrThrow(sightingListQuerySchema, query);
    return sightingsService.list({
      period: params.period ?? "ALL",
      cursor: params.cursor ?? null,
      limit: params.limit,
    });
  })
  .get("/:id", ({ params }) => sightingsService.get(params.id))
  .post("/", ({ currentUser, body }) => {
    const user = requireAuth(currentUser);
    const input = parseOrThrow(sightingInputSchema, body);
    return sightingsService.create(user.id, input);
  })
  .delete("/:id", async ({ currentUser, params }) => {
    const user = requireAuth(currentUser);
    await sightingsService.remove(params.id, user.id);
    return { ok: true };
  });
