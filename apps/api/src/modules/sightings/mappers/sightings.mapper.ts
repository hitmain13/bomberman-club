import type { SightingResponse } from "@bomberman/types";

import type { SightingWithRelations } from "../repositories/sightings.repository";

export function toSightingResponse(sighting: SightingWithRelations): SightingResponse {
  return {
    id: sighting.id,
    userId: sighting.userId,
    author: {
      id: sighting.user.id,
      username: sighting.user.username,
      avatarUrl: sighting.user.avatar?.url ?? null,
    },
    uploadId: sighting.uploadId,
    imageUrl: sighting.upload.url,
    title: sighting.title,
    description: sighting.description,
    latitude: sighting.latitude,
    longitude: sighting.longitude,
    locationLabel: sighting.locationLabel,
    occurredAt: sighting.occurredAt.toISOString(),
    createdAt: sighting.createdAt.toISOString(),
  };
}
