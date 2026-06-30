import { Elysia } from "elysia";

import { catalogService } from "../services/catalog.service";

export const catalogController = new Elysia({ prefix: "/catalog" })
  .get("/part-categories", () => catalogService.listPartCategories())
  .get("/part-categories/:id/parts", ({ params }) => catalogService.listPartsByCategory(params.id))
  .get("/spec-definitions", () => catalogService.listSpecDefinitions());
