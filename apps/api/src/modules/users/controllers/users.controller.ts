import { Elysia } from "elysia";

import { parseOrThrow } from "@/common/validation";
import { authPlugin, requireAuth } from "@/plugins/auth.plugin";

import { updateMeSchema } from "../schemas/users.schema";
import { usersService } from "../services/users.service";

export const usersController = new Elysia({ prefix: "/users" })
  .use(authPlugin)
  .get("/me", ({ currentUser }) => {
    const user = requireAuth(currentUser);
    return usersService.getMe(user.id);
  })
  .patch("/me", ({ currentUser, body }) => {
    const user = requireAuth(currentUser);
    const input = parseOrThrow(updateMeSchema, body);
    return usersService.updateMe(user.id, input);
  })
  .get("/:username", ({ params }) => usersService.getByUsername(params.username));
