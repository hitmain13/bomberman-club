import { geoReverseQuerySchema } from "@bomberman/types";
import { Elysia } from "elysia";
import { z } from "zod";

import { getGeoSearchService } from "@/shared/geo/geo-search";
import { getReverseGeocodeService } from "@/shared/geo/reverse-geocode";

const searchQuerySchema = z.object({
  q: z.string().min(3).max(120),
});

export const geoController = new Elysia({ prefix: "/geo" })
  .get("/search", async ({ query }) => {
    const parsed = searchQuerySchema.parse(query);
    const results = await getGeoSearchService().search(parsed.q);
    return { results };
  })
  .get("/reverse", async ({ query }) => {
    const parsed = geoReverseQuerySchema.parse(query);
    const label = await getReverseGeocodeService().resolve(parsed.lat, parsed.lng);
    return { label };
  });
