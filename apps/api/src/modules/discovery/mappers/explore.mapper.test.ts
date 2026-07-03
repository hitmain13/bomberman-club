import type { Car, Upload, User } from "@prisma/client";
import { describe, expect, it } from "vitest";

import type { CarWithOwner, UserWithFollowerCount } from "../repositories/discovery.repository";

import { toExploreCar, toExplorePerson } from "./explore.mapper";

const baseUser: User = {
  id: "user_1",
  username: "speed.fabio",
  email: "fabio@example.com",
  passwordHash: "hash",
  role: "USER",
  bio: "Apaixonado por turbo.",
  city: "São Paulo - SP",
  avatarUploadId: null,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  bannedAt: null,
};

const avatarUpload: Upload = {
  id: "upload_1",
  ownerId: "user_1",
  bucketKey: "u/avatar.jpg",
  url: "https://example.com/avatar.jpg",
  mime: "image/jpeg",
  size: 1024,
  width: 256,
  height: 256,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
};

describe("toExplorePerson", () => {
  it("maps a user row into an ExplorePerson including counts and follow state", () => {
    const row: UserWithFollowerCount = {
      ...baseUser,
      avatar: avatarUpload,
      _count: { followers: 128 },
    };

    const result = toExplorePerson(row, 3, true);

    expect(result).toEqual({
      id: "user_1",
      username: "speed.fabio",
      bio: "Apaixonado por turbo.",
      city: "São Paulo - SP",
      avatarUrl: "https://example.com/avatar.jpg",
      createdAt: "2024-01-01T00:00:00.000Z",
      carsCount: 3,
      followersCount: 128,
      isFollowedByMe: true,
    });
  });

  it("falls back to null avatarUrl when there is no avatar upload", () => {
    const row: UserWithFollowerCount = {
      ...baseUser,
      avatar: null,
      _count: { followers: 0 },
    };

    const result = toExplorePerson(row, 0, false);

    expect(result.avatarUrl).toBeNull();
    expect(result.isFollowedByMe).toBe(false);
  });
});

describe("toExploreCar", () => {
  it("maps a car-with-owner row into an ExploreCar with a lightweight owner", () => {
    const car: Car = {
      id: "car_1",
      garageId: "garage_1",
      nickname: "GTI Mk7",
      brand: "Volkswagen",
      model: "Golf GTI",
      generation: "Mk7",
      year: 2018,
      fuel: "GASOLINE",
      engine: "EA888",
      weightKg: 1320,
      horsepowerHp: 320,
      torqueNm: 420,
      currentKm: 58_500,
      plate: null,
      coverUploadId: null,
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-02T00:00:00.000Z"),
    };
    const row: CarWithOwner = {
      ...car,
      cover: null,
      garage: { user: { ...baseUser, avatar: avatarUpload } },
    };

    const result = toExploreCar(row);

    expect(result.car.id).toBe("car_1");
    expect(result.car.nickname).toBe("GTI Mk7");
    expect(result.owner).toEqual({
      id: "user_1",
      username: "speed.fabio",
      avatarUrl: "https://example.com/avatar.jpg",
    });
  });
});
