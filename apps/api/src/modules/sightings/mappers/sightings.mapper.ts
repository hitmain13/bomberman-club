import type { SightingResponse, SightingStats } from "@bomberman/types";

import type { SightingWithRelations } from "../repositories/sightings.repository";

export function toSightingImages(sighting: SightingWithRelations): SightingResponse["images"] {
  const source =
    sighting.images.length > 0
      ? sighting.images
      : [{ uploadId: sighting.uploadId, upload: sighting.upload, position: 0 } as const];

  return source.map((image) => ({
    uploadId: image.uploadId,
    url: image.upload.url,
    position: image.position,
  }));
}

export function toSightingResponse(
  sighting: SightingWithRelations,
  stats: SightingStats = { likeCount: 0, commentCount: 0, liked: false },
): SightingResponse {
  const images = toSightingImages(sighting);
  const cover = images[0];

  return {
    id: sighting.id,
    userId: sighting.userId,
    author: {
      id: sighting.user.id,
      username: sighting.user.username,
      avatarUrl: sighting.user.avatar?.url ?? null,
    },
    uploadId: cover?.uploadId ?? sighting.uploadId,
    imageUrl: cover?.url ?? sighting.upload.url,
    images,
    title: sighting.title,
    description: sighting.description,
    latitude: sighting.latitude,
    longitude: sighting.longitude,
    street: sighting.street,
    locationLabel: sighting.locationLabel,
    occurredAt: sighting.occurredAt.toISOString(),
    createdAt: sighting.createdAt.toISOString(),
    stats,
  };
}
