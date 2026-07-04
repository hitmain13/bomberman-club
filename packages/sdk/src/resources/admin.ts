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
const partCategorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
});
const partSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  manufacturer: z.string(),
  name: z.string(),
});
const specDefinitionSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  type: z.string(),
  unit: z.string().nullable(),
  category: z.string().nullable(),
  enumOptions: z.array(z.string()).nullable(),
});

const categoriesResponseSchema = z.array(partCategorySchema);
const partsResponseSchema = z.array(partSchema);
const specsResponseSchema = z.array(specDefinitionSchema);

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

  listCatalogCategories() {
    return this.http.request({
      method: "GET",
      path: "/admin/catalog/part-categories",
      responseSchema: categoriesResponseSchema,
    });
  }

  createCatalogCategory(input: { slug: string; name: string }) {
    return this.http.request({
      method: "POST",
      path: "/admin/catalog/part-categories",
      body: input,
      responseSchema: partCategorySchema,
    });
  }

  updateCatalogCategory(id: string, input: { slug?: string; name?: string }) {
    return this.http.request({
      method: "PATCH",
      path: `/admin/catalog/part-categories/${id}`,
      body: input,
      responseSchema: partCategorySchema,
    });
  }

  deleteCatalogCategory(id: string) {
    return this.http.request({
      method: "DELETE",
      path: `/admin/catalog/part-categories/${id}`,
      responseSchema: okResponseSchema,
    });
  }

  listCatalogParts(categoryId: string) {
    return this.http.request({
      method: "GET",
      path: `/admin/catalog/part-categories/${categoryId}/parts`,
      responseSchema: partsResponseSchema,
    });
  }

  createCatalogPart(input: { categoryId: string; manufacturer: string; name: string }) {
    return this.http.request({
      method: "POST",
      path: "/admin/catalog/parts",
      body: input,
      responseSchema: partSchema,
    });
  }

  updateCatalogPart(
    id: string,
    input: { categoryId?: string; manufacturer?: string; name?: string },
  ) {
    return this.http.request({
      method: "PATCH",
      path: `/admin/catalog/parts/${id}`,
      body: input,
      responseSchema: partSchema,
    });
  }

  deleteCatalogPart(id: string) {
    return this.http.request({
      method: "DELETE",
      path: `/admin/catalog/parts/${id}`,
      responseSchema: okResponseSchema,
    });
  }

  listCatalogSpecs() {
    return this.http.request({
      method: "GET",
      path: "/admin/catalog/spec-definitions",
      responseSchema: specsResponseSchema,
    });
  }

  createCatalogSpec(input: {
    key: string;
    name: string;
    type: string;
    unit?: string | null;
    category?: string | null;
    enumOptions?: string[] | null;
  }) {
    return this.http.request({
      method: "POST",
      path: "/admin/catalog/spec-definitions",
      body: input,
      responseSchema: specDefinitionSchema,
    });
  }

  updateCatalogSpec(
    id: string,
    input: {
      key?: string;
      name?: string;
      type?: string;
      unit?: string | null;
      category?: string | null;
      enumOptions?: string[] | null;
    },
  ) {
    return this.http.request({
      method: "PATCH",
      path: `/admin/catalog/spec-definitions/${id}`,
      body: input,
      responseSchema: specDefinitionSchema,
    });
  }

  deleteCatalogSpec(id: string) {
    return this.http.request({
      method: "DELETE",
      path: `/admin/catalog/spec-definitions/${id}`,
      responseSchema: okResponseSchema,
    });
  }
}
