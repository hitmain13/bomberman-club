import { Elysia, t } from "elysia";

import { authPlugin, requireAdmin } from "@/plugins/auth.plugin";
import { adminCatalogService } from "../services/admin-catalog.service";

import { adminService } from "../services/admin.service";

export const adminController = new Elysia({ prefix: "/admin" })
  .use(authPlugin)
  .get(
    "/uploads",
    async ({ query }) => {
      const limit = query.limit ?? 50;
      const uploads = await adminService.listUploads(limit, query.cursor);
      return { data: uploads };
    },
    {
      query: t.Object({
        limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
        cursor: t.Optional(t.String()),
      }),
      beforeHandle: ({ currentUser }) => requireAdmin(currentUser),
    },
  )
  .delete(
    "/uploads/:id",
    async ({ params }) => {
      await adminService.removeUpload(params.id);
      return { ok: true };
    },
    {
      beforeHandle: ({ currentUser }) => requireAdmin(currentUser),
    },
  )
  .get(
    "/users",
    async ({ query }) => {
      const limit = query.limit ?? 50;
      const users = await adminService.listUsers(limit, query.cursor);
      return { data: users };
    },
    {
      query: t.Object({
        limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
        cursor: t.Optional(t.String()),
      }),
      beforeHandle: ({ currentUser }) => requireAdmin(currentUser),
    },
  )
  .post(
    "/users/:id/ban",
    async ({ params }) => {
      await adminService.banUser(params.id);
      return { ok: true };
    },
    {
      beforeHandle: ({ currentUser }) => requireAdmin(currentUser),
    },
  )
  .post(
    "/users/:id/unban",
    async ({ params }) => {
      await adminService.unbanUser(params.id);
      return { ok: true };
    },
    {
      beforeHandle: ({ currentUser }) => requireAdmin(currentUser),
    },
  )
  .get("/catalog/part-categories", () => adminCatalogService.listPartCategories(), {
    beforeHandle: ({ currentUser }) => requireAdmin(currentUser),
  })
  .post("/catalog/part-categories", ({ body }) => adminCatalogService.createPartCategory(body), {
    beforeHandle: ({ currentUser }) => requireAdmin(currentUser),
  })
  .patch(
    "/catalog/part-categories/:id",
    ({ params, body }) => adminCatalogService.updatePartCategory(params.id, body),
    { beforeHandle: ({ currentUser }) => requireAdmin(currentUser) },
  )
  .delete(
    "/catalog/part-categories/:id",
    async ({ params }) => {
      await adminCatalogService.deletePartCategory(params.id);
      return { ok: true };
    },
    { beforeHandle: ({ currentUser }) => requireAdmin(currentUser) },
  )
  .get(
    "/catalog/part-categories/:id/parts",
    ({ params }) => adminCatalogService.listPartsByCategory(params.id),
    { beforeHandle: ({ currentUser }) => requireAdmin(currentUser) },
  )
  .post("/catalog/parts", ({ body }) => adminCatalogService.createPart(body), {
    beforeHandle: ({ currentUser }) => requireAdmin(currentUser),
  })
  .patch(
    "/catalog/parts/:id",
    ({ params, body }) => adminCatalogService.updatePart(params.id, body),
    { beforeHandle: ({ currentUser }) => requireAdmin(currentUser) },
  )
  .delete(
    "/catalog/parts/:id",
    async ({ params }) => {
      await adminCatalogService.deletePart(params.id);
      return { ok: true };
    },
    { beforeHandle: ({ currentUser }) => requireAdmin(currentUser) },
  )
  .get("/catalog/spec-definitions", () => adminCatalogService.listSpecDefinitions(), {
    beforeHandle: ({ currentUser }) => requireAdmin(currentUser),
  })
  .post("/catalog/spec-definitions", ({ body }) => adminCatalogService.createSpecDefinition(body), {
    beforeHandle: ({ currentUser }) => requireAdmin(currentUser),
  })
  .patch(
    "/catalog/spec-definitions/:id",
    ({ params, body }) => adminCatalogService.updateSpecDefinition(params.id, body),
    { beforeHandle: ({ currentUser }) => requireAdmin(currentUser) },
  )
  .delete(
    "/catalog/spec-definitions/:id",
    async ({ params }) => {
      await adminCatalogService.deleteSpecDefinition(params.id);
      return { ok: true };
    },
    { beforeHandle: ({ currentUser }) => requireAdmin(currentUser) },
  );
