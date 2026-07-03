import { Elysia } from "elysia";

import { authPlugin } from "@/plugins/auth.plugin";

import { likedItemsService } from "../services/liked-items.service";
import { profileStatsService } from "../services/profile-stats.service";

export const userProfileExtrasController = new Elysia({ prefix: "/users" })
  .use(authPlugin)
  .get("/:username/stats", ({ currentUser, params }) =>
    profileStatsService.get(params.username, currentUser?.id ?? null),
  )
  .get("/:username/likes", ({ params }) => likedItemsService.listByUsername(params.username));
