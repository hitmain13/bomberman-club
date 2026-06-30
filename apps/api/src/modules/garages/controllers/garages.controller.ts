import { Elysia } from "elysia";

import { authPlugin, requireAuth } from "@/plugins/auth.plugin";

import { garagesService } from "../services/garages.service";

export const garagesController = new Elysia({ prefix: "/garages" })
  .use(authPlugin)
  .get("/mine", ({ currentUser }) => {
    const user = requireAuth(currentUser);
    return garagesService.listMine(user.id);
  });
