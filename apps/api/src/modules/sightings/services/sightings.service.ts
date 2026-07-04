import { type SightingInput, type SightingResponse, periodStartDate } from "@bomberman/types";

import { ForbiddenError, NotFoundError } from "@/common/errors";

import { toSightingResponse } from "../mappers/sightings.mapper";
import { sightingsRepository } from "../repositories/sightings.repository";

export interface SightingListResult {
  items: SightingResponse[];
  nextCursor: string | null;
}

interface ListParams {
  period: "TODAY" | "WEEK" | "MONTH" | "YEAR" | "ALL";
  cursor: string | null;
  limit: number;
}

export class SightingsService {
  async listByUsername(username: string): Promise<SightingResponse[]> {
    const rows = await sightingsRepository.listByUsername(username);
    return rows.map(toSightingResponse);
  }

  async list(params: ListParams): Promise<SightingListResult> {
    const after = periodStartDate(params.period);
    const rows = await sightingsRepository.list({
      after,
      cursor: params.cursor,
      limit: params.limit,
    });
    const hasMore = rows.length > params.limit;
    const items = hasMore ? rows.slice(0, params.limit) : rows;
    const last = items.at(-1);
    return {
      items: items.map(toSightingResponse),
      nextCursor: hasMore && last ? last.id : null,
    };
  }

  async get(id: string): Promise<SightingResponse> {
    const sighting = await sightingsRepository.findById(id);
    if (!sighting) {
      throw new NotFoundError("Sighting", id);
    }
    return toSightingResponse(sighting);
  }

  async create(userId: string, input: SightingInput): Promise<SightingResponse> {
    const created = await sightingsRepository.create({
      userId,
      uploadId: input.uploadId,
      title: input.title,
      description: input.description ?? null,
      latitude: input.latitude,
      longitude: input.longitude,
      locationLabel: input.locationLabel ?? null,
      occurredAt: new Date(input.occurredAt),
    });
    return toSightingResponse(created);
  }

  async remove(id: string, userId: string): Promise<void> {
    const sighting = await sightingsRepository.findById(id);
    if (!sighting) {
      throw new NotFoundError("Sighting", id);
    }
    if (sighting.userId !== userId) {
      throw new ForbiddenError("Você não pode remover este flagrado.");
    }
    await sightingsRepository.remove(id);
  }
}

export const sightingsService = new SightingsService();
