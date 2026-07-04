import {
  type SightingInput,
  type SightingResponse,
  type SightingUpdateInput,
  sightingInputSchema,
  sightingResponseSchema,
  sightingUpdateSchema,
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

  listByUser(username: string): Promise<SightingResponse[]> {
    return this.http.request({
      path: `/users/${encodeURIComponent(username)}/sightings`,
      responseSchema: z.array(sightingResponseSchema),
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

  update(id: string, input: SightingUpdateInput): Promise<SightingResponse> {
    const body = sightingUpdateSchema.parse(input);
    return this.http.request({
      method: "PATCH",
      path: `/sightings/${encodeURIComponent(id)}`,
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
