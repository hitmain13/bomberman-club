import {
  type SightingInput,
  type SightingResponse,
  type SightingUpdateInput,
  periodStartDate,
  resolveUploadIds,
} from "@bomberman/types";
import type { TargetType } from "@prisma/client";

import { ForbiddenError, NotFoundError } from "@/common/errors";
import { canManageSighting } from "@/common/policies/sighting.policy";
import { commentsRepository } from "@/modules/social/repositories/comments.repository";
import { likesRepository } from "@/modules/social/repositories/likes.repository";
import { getReverseGeocodeService } from "@/shared/geo/reverse-geocode";

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

const SIGHTING_TARGET: TargetType = "SIGHTING";

export class SightingsService {
  private async buildStats(
    sightingId: string,
    viewerId: string | null,
  ): Promise<SightingResponse["stats"]> {
    const [likeCount, commentCount, likedRow] = await Promise.all([
      likesRepository.count(SIGHTING_TARGET, sightingId),
      commentsRepository.countByTarget(SIGHTING_TARGET, sightingId),
      viewerId
        ? likesRepository.find(viewerId, SIGHTING_TARGET, sightingId)
        : Promise.resolve(null),
    ]);

    return {
      likeCount,
      commentCount,
      liked: likedRow !== null,
    };
  }

  private async mapMany(
    rows: Awaited<ReturnType<typeof sightingsRepository.list>>,
    viewerId: string | null,
  ): Promise<SightingResponse[]> {
    return Promise.all(
      rows.map(async (row) => toSightingResponse(row, await this.buildStats(row.id, viewerId))),
    );
  }

  async listByUsername(
    username: string,
    viewerId: string | null = null,
  ): Promise<SightingResponse[]> {
    const rows = await sightingsRepository.listByUsername(username);
    return this.mapMany(rows, viewerId);
  }

  async list(params: ListParams, viewerId: string | null = null): Promise<SightingListResult> {
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
      items: await this.mapMany(items, viewerId),
      nextCursor: hasMore && last ? last.id : null,
    };
  }

  async get(id: string, viewerId: string | null = null): Promise<SightingResponse> {
    const sighting = await sightingsRepository.findById(id);
    if (!sighting) {
      throw new NotFoundError("Sighting", id);
    }
    return toSightingResponse(sighting, await this.buildStats(id, viewerId));
  }

  async create(userId: string, input: SightingInput): Promise<SightingResponse> {
    const uploadIds = resolveUploadIds(input);
    let street = input.street ?? input.locationLabel ?? null;
    if (!street) {
      street = await getReverseGeocodeService().resolve(input.latitude, input.longitude);
    }

    const created = await sightingsRepository.create({
      userId,
      uploadId: uploadIds[0] ?? "",
      uploadIds,
      title: input.title,
      description: input.description ?? null,
      latitude: input.latitude,
      longitude: input.longitude,
      street,
      locationLabel: street,
      occurredAt: new Date(input.occurredAt),
    });
    return toSightingResponse(created, {
      likeCount: 0,
      commentCount: 0,
      liked: false,
    });
  }

  async update(
    id: string,
    viewer: { id: string; role: "USER" | "ADMIN" },
    input: SightingUpdateInput,
  ): Promise<SightingResponse> {
    const sighting = await sightingsRepository.findById(id);
    if (!sighting) {
      throw new NotFoundError("Sighting", id);
    }
    if (!canManageSighting(viewer, sighting.userId)) {
      throw new ForbiddenError("Você não pode editar este flagrado.");
    }

    const latitude = input.latitude ?? sighting.latitude;
    const longitude = input.longitude ?? sighting.longitude;
    let street = input.street ?? sighting.street;
    const locationChanged =
      input.latitude !== undefined ||
      input.longitude !== undefined ||
      (input.street === undefined && !street);

    if (locationChanged && !street) {
      street = await getReverseGeocodeService().resolve(latitude, longitude);
    }

    const uploadIds = input.uploadIds;
    const updated = await sightingsRepository.update(id, {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.latitude !== undefined ? { latitude: input.latitude } : {}),
      ...(input.longitude !== undefined ? { longitude: input.longitude } : {}),
      ...(street !== undefined ? { street, locationLabel: street } : {}),
      ...(input.occurredAt !== undefined ? { occurredAt: new Date(input.occurredAt) } : {}),
      ...(uploadIds ? { uploadId: uploadIds[0], uploadIds } : {}),
    });

    return toSightingResponse(updated, await this.buildStats(id, viewer.id));
  }

  async remove(id: string, viewer: { id: string; role: "USER" | "ADMIN" }): Promise<void> {
    const sighting = await sightingsRepository.findById(id);
    if (!sighting) {
      throw new NotFoundError("Sighting", id);
    }
    if (!canManageSighting(viewer, sighting.userId)) {
      throw new ForbiddenError("Você não pode remover este flagrado.");
    }
    await sightingsRepository.remove(id);
  }
}

export const sightingsService = new SightingsService();
