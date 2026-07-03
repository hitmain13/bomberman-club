import { Elysia, t } from "elysia";

import { authPlugin, requireAdmin } from "@/plugins/auth.plugin";

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
  );
