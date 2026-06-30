import {
  type CarInput,
  type CarPartInput,
  type CarPartResponse,
  type CarResponse,
  type SpecValueInput,
  type SpecValueResponse,
  carInputSchema,
  carPartInputSchema,
  carPartResponseSchema,
  carResponseSchema,
  specValueInputSchema,
  specValueResponseSchema,
} from "@bomberman/types";
import { z } from "zod";

import type { HttpClient } from "../http";

export class CarsResource {
  constructor(private readonly http: HttpClient) {}

  listMine(): Promise<CarResponse[]> {
    return this.http.request({
      path: "/cars/mine",
      responseSchema: z.array(carResponseSchema),
    });
  }

  listByUser(username: string): Promise<CarResponse[]> {
    return this.http.request({
      path: `/users/${encodeURIComponent(username)}/cars`,
      responseSchema: z.array(carResponseSchema),
    });
  }

  get(id: string): Promise<CarResponse> {
    return this.http.request({
      path: `/cars/${encodeURIComponent(id)}`,
      responseSchema: carResponseSchema,
    });
  }

  create(input: CarInput): Promise<CarResponse> {
    const body = carInputSchema.parse(input);
    return this.http.request({
      method: "POST",
      path: "/cars",
      body,
      responseSchema: carResponseSchema,
    });
  }

  update(id: string, input: CarInput): Promise<CarResponse> {
    const body = carInputSchema.parse(input);
    return this.http.request({
      method: "PATCH",
      path: `/cars/${encodeURIComponent(id)}`,
      body,
      responseSchema: carResponseSchema,
    });
  }

  remove(id: string): Promise<{ ok: boolean }> {
    return this.http.request({
      method: "DELETE",
      path: `/cars/${encodeURIComponent(id)}`,
      responseSchema: z.object({ ok: z.boolean() }),
    });
  }

  listParts(carId: string): Promise<CarPartResponse[]> {
    return this.http.request({
      path: `/cars/${encodeURIComponent(carId)}/parts`,
      responseSchema: z.array(carPartResponseSchema),
    });
  }

  addPart(carId: string, input: CarPartInput): Promise<CarPartResponse> {
    const body = carPartInputSchema.parse(input);
    return this.http.request({
      method: "POST",
      path: `/cars/${encodeURIComponent(carId)}/parts`,
      body,
      responseSchema: carPartResponseSchema,
    });
  }

  removePart(carId: string, carPartId: string): Promise<{ ok: boolean }> {
    return this.http.request({
      method: "DELETE",
      path: `/cars/${encodeURIComponent(carId)}/parts/${encodeURIComponent(carPartId)}`,
      responseSchema: z.object({ ok: z.boolean() }),
    });
  }

  listSpecs(carId: string): Promise<SpecValueResponse[]> {
    return this.http.request({
      path: `/cars/${encodeURIComponent(carId)}/specs`,
      responseSchema: z.array(specValueResponseSchema),
    });
  }

  setSpec(carId: string, input: SpecValueInput): Promise<SpecValueResponse> {
    const body = specValueInputSchema.parse(input);
    return this.http.request({
      method: "PUT",
      path: `/cars/${encodeURIComponent(carId)}/specs`,
      body,
      responseSchema: specValueResponseSchema,
    });
  }
}
