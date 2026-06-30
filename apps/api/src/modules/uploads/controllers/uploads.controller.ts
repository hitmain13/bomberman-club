import { Elysia } from "elysia";

import { ValidationError } from "@/common/errors";
import { authPlugin, requireAuth } from "@/plugins/auth.plugin";

import { uploadsService } from "../services/uploads.service";

export const uploadsController = new Elysia({ prefix: "/uploads" })
  .use(authPlugin)
  .post("/", async ({ currentUser, request }) => {
    const user = requireAuth(currentUser);
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      throw new ValidationError("Campo 'file' é obrigatório.");
    }
    return uploadsService.upload(user.id, file);
  })
  .get("/:id", ({ params }) => uploadsService.get(params.id))
  .delete("/:id", async ({ currentUser, params }) => {
    const user = requireAuth(currentUser);
    await uploadsService.remove(params.id, user.id);
    return { ok: true };
  });
