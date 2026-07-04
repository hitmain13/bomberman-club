import type { SightingResponse, SightingStats } from "@bomberman/types";

export const emptySightingStats: SightingStats = {
  likeCount: 0,
  commentCount: 0,
  liked: false,
};

export function sightingResponseFixture(
  overrides: Partial<SightingResponse> = {},
): SightingResponse {
  const imageUrl = overrides.imageUrl ?? "https://example.com/img.jpg";
  return {
    id: "s_1",
    userId: "u_1",
    author: { id: "u_1", username: "speed.fabio", avatarUrl: null },
    uploadId: "up_1",
    imageUrl,
    images: overrides.images ?? [{ uploadId: "up_1", url: imageUrl, position: 0 }],
    title: "Flagrado",
    description: null,
    latitude: -23.55,
    longitude: -46.63,
    street: null,
    locationLabel: null,
    occurredAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    stats: emptySightingStats,
    ...overrides,
  };
}
