import { z } from "zod";

import type { HttpClient } from "../http";

const adminUploadSchema = z.object({
  id: z.string(),
  url: z.string(),
  mime: z.string(),
  size: z.number(),
  createdAt: z.string(),
  owner: z.object({
    username: z.string(),
    email: z.string(),
  }),
});

const adminUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  role: z.string(),
  bannedAt: z.string().nullable(),
  createdAt: z.string(),
});

const adminUploadsResponseSchema = z.object({
  data: z.array(adminUploadSchema),
});

const adminUsersResponseSchema = z.object({
  data: z.array(adminUserSchema),
});

const okResponseSchema = z.object({ ok: z.boolean() });

export type AdminUpload = z.infer<typeof adminUploadSchema>;
export type AdminUser = z.infer<typeof adminUserSchema>;

export class AdminResource {
  constructor(private http: HttpClient) {}

  async listUploads(limit = 50, cursor?: string) {
    return this.http.request({
      method: "GET",
      path: "/admin/uploads",
      query: { limit, cursor },
      responseSchema: adminUploadsResponseSchema,
    });
  }

  async deleteUpload(id: string) {
    return this.http.request({
      method: "DELETE",
      path: `/admin/uploads/${id}`,
      responseSchema: okResponseSchema,
    });
  }

  async listUsers(limit = 50, cursor?: string) {
    return this.http.request({
      method: "GET",
      path: "/admin/users",
      query: { limit, cursor },
      responseSchema: adminUsersResponseSchema,
    });
  }

  async banUser(id: string) {
    return this.http.request({
      method: "POST",
      path: `/admin/users/${id}/ban`,
      body: {},
      responseSchema: okResponseSchema,
    });
  }

  async unbanUser(id: string) {
    return this.http.request({
      method: "POST",
      path: `/admin/users/${id}/unban`,
      body: {},
      responseSchema: okResponseSchema,
    });
  }
}
