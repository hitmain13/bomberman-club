import {
  type Part,
  type PartCategory,
  type SpecDefinition,
  partCategorySchema,
  partSchema,
  specDefinitionSchema,
} from "@bomberman/types";
import { z } from "zod";

import type { HttpClient } from "../http";

export class CatalogResource {
  constructor(private readonly http: HttpClient) {}

  partCategories(): Promise<PartCategory[]> {
    return this.http.request({
      path: "/catalog/part-categories",
      responseSchema: z.array(partCategorySchema),
    });
  }

  partsByCategory(categoryId: string): Promise<Part[]> {
    return this.http.request({
      path: `/catalog/part-categories/${encodeURIComponent(categoryId)}/parts`,
      responseSchema: z.array(partSchema),
    });
  }

  specDefinitions(): Promise<SpecDefinition[]> {
    return this.http.request({
      path: "/catalog/spec-definitions",
      responseSchema: z.array(specDefinitionSchema),
    });
  }
}
