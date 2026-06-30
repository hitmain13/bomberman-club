import {
  type SightingInput,
  type SightingResponse,
  sightingInputSchema,
  sightingResponseSchema,
} from "@bomberman/types";
import type { SightingPeriod } from "@bomberman/types";
import { z } from "zod";

import type { HttpClient } from "../http";

const listResponseSchema = z.object({
  items: z.array(sightingResponseSchema),
  nextCursor: z.string().nullable(),
});

export interface SightingListResult {
  items: ReadonlyArray<SightingResponse>;
  nextCursor: string | null;
}

export class SightingsResource {
  constructor(private readonly http: HttpClient) {}

  list(params?: {
    period?: SightingPeriod;
    cursor?: string;
    limit?: number;
  }): Promise<SightingListResult> {
    return this.http.request({
      path: "/sightings",
      query: {
        period: params?.period,
        cursor: params?.cursor,
        limit: params?.limit,
      },
      responseSchema: listResponseSchema,
    });
  }

  get(id: string): Promise<SightingResponse> {
    return this.http.request({
      path: `/sightings/${encodeURIComponent(id)}`,
      responseSchema: sightingResponseSchema,
    });
  }

  create(input: SightingInput): Promise<SightingResponse> {
    const body = sightingInputSchema.parse(input);
    return this.http.request({
      method: "POST",
      path: "/sightings",
      body,
      responseSchema: sightingResponseSchema,
    });
  }

  remove(id: string): Promise<{ ok: boolean }> {
    return this.http.request({
      method: "DELETE",
      path: `/sightings/${encodeURIComponent(id)}`,
      responseSchema: z.object({ ok: z.boolean() }),
    });
  }
}
