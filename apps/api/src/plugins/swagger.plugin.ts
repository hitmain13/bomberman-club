import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

import { env } from "@/config/env";

const isDocsEnabled = env.NODE_ENV !== "production";

export const swaggerPlugin = isDocsEnabled
  ? new Elysia({ name: "swagger" }).use(
      swagger({
        path: "/docs",
        documentation: {
          info: {
            title: "Bomberman Club API",
            version: "0.0.0",
            description: "Bomberman Club backend (Elysia).",
          },
          tags: [
            { name: "auth", description: "Authentication" },
            { name: "users", description: "User profiles" },
            { name: "garages", description: "Garages" },
            { name: "cars", description: "Cars" },
            { name: "catalog", description: "Parts and Specifications catalog" },
          ],
        },
      }),
    )
  : new Elysia({ name: "swagger-noop" });
