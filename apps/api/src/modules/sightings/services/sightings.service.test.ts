import { beforeEach, describe, expect, it, vi } from "vitest";

import type { SightingInput } from "@bomberman/types";

import { sightingsRepository } from "../repositories/sightings.repository";
import { SightingsService } from "./sightings.service";

vi.mock("../repositories/sightings.repository", () => ({
  sightingsRepository: {
    create: vi.fn(),
    update: vi.fn(),
    findById: vi.fn(),
    list: vi.fn(),
    listByUsername: vi.fn(),
    remove: vi.fn(),
  },
}));

const resolveMock = vi.fn();

vi.mock("@/shared/geo/reverse-geocode", () => ({
  getReverseGeocodeService: () => ({
    resolve: resolveMock,
  }),
}));

describe("SightingsService.create", () => {
  const service = new SightingsService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("persists street from reverse geocode when absent in input", async () => {
    resolveMock.mockResolvedValue("Rua Lira, Vila Madalena");

    const input: SightingInput = {
      uploadId: "upload_1",
      title: "DS3 forjado",
      latitude: -23.55291,
      longitude: -46.69646,
      occurredAt: new Date().toISOString(),
    };

    vi.mocked(sightingsRepository.create).mockResolvedValue({
      id: "sig_1",
      userId: "user_1",
      uploadId: input.uploadId ?? "upload_1",
      title: input.title,
      description: null,
      latitude: input.latitude,
      longitude: input.longitude,
      street: "Rua Lira, Vila Madalena",
      locationLabel: "Rua Lira, Vila Madalena",
      occurredAt: new Date(input.occurredAt),
      createdAt: new Date(),
      updatedAt: new Date(),
      upload: { id: "upload_1", url: "https://cdn.example/photo.jpg" } as never,
      images: [
        {
          id: "si_1",
          sightingId: "sig_1",
          uploadId: "upload_1",
          position: 0,
          createdAt: new Date(),
          upload: { id: "upload_1", url: "https://cdn.example/photo.jpg" } as never,
        },
      ],
      user: {
        id: "user_1",
        username: "matsuf",
        avatar: null,
      } as never,
    });

    const result = await service.create("user_1", input);

    expect(resolveMock).toHaveBeenCalledWith(input.latitude, input.longitude);
    expect(sightingsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        street: "Rua Lira, Vila Madalena",
        locationLabel: "Rua Lira, Vila Madalena",
        uploadIds: ["upload_1"],
      }),
    );
    expect(result.street).toBe("Rua Lira, Vila Madalena");
  });

  it("skips geocode when street is provided", async () => {
    const input: SightingInput = {
      uploadId: "upload_1",
      title: "Flagrado",
      latitude: -23.55,
      longitude: -46.65,
      street: "Rua Augusta, Consolação",
      occurredAt: new Date().toISOString(),
    };

    vi.mocked(sightingsRepository.create).mockResolvedValue({
      id: "sig_1",
      userId: "user_1",
      uploadId: input.uploadIds?.[0] ?? "upload_1",
      title: input.title,
      description: null,
      latitude: input.latitude,
      longitude: input.longitude,
      street: input.street ?? null,
      locationLabel: input.street ?? null,
      occurredAt: new Date(input.occurredAt),
      createdAt: new Date(),
      updatedAt: new Date(),
      upload: { id: "upload_1", url: "https://cdn.example/photo.jpg" } as never,
      images: [],
      user: {
        id: "user_1",
        username: "matsuf",
        avatar: null,
      } as never,
    });

    await service.create("user_1", input);

    expect(resolveMock).not.toHaveBeenCalled();
    expect(sightingsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ street: "Rua Augusta, Consolação" }),
    );
  });
});
