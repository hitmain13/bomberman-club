import {
  type GarageInput,
  type GarageResponse,
  garageInputSchema,
  garageResponseSchema,
} from "@bomberman/types";
import { z } from "zod";

import type { HttpClient } from "../http";

export class GaragesResource {
  constructor(private readonly http: HttpClient) {}

  listMine(): Promise<GarageResponse[]> {
    return this.http.request({
      path: "/garages/mine",
      responseSchema: z.array(garageResponseSchema),
    });
  }

  listByUser(username: string): Promise<GarageResponse[]> {
    return this.http.request({
      path: `/users/${encodeURIComponent(username)}/garages`,
      responseSchema: z.array(garageResponseSchema),
    });
  }

  create(input: GarageInput): Promise<GarageResponse> {
    const body = garageInputSchema.parse(input);
    return this.http.request({
      method: "POST",
      path: "/garages",
      body,
      responseSchema: garageResponseSchema,
    });
  }
}
