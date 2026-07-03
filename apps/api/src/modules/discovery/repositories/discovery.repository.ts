import { Prisma } from "@prisma/client";
import type { Car, Upload, User } from "@prisma/client";

import { prisma } from "@/database/prisma";
import type { CarWithCover } from "@/modules/cars/repositories/cars.repository";
import type { SightingWithRelations } from "@/modules/sightings/repositories/sightings.repository";

export type UserWithFollowerCount = User & {
  avatar: Upload | null;
  _count: { followers: number };
};

export type CarWithOwner = Car & {
  cover: { url: string } | null;
  garage: { user: User & { avatar: Upload | null } };
};

const carWithCoverInclude = { cover: { select: { url: true } } } as const;
const sightingWithRelationsInclude = {
  upload: true,
  user: { include: { avatar: true } },
} as const;
const carWithOwnerInclude = {
  cover: { select: { url: true } },
  garage: { include: { user: { include: { avatar: true } } } },
} as const;

function buildExplorePeopleWhere(params: {
  query: string | null;
  city: string | null;
  since: Date | null;
}): Prisma.UserWhereInput {
  const and: Prisma.UserWhereInput[] = [];
  if (params.query) {
    and.push({ username: { contains: params.query, mode: Prisma.QueryMode.insensitive } });
  }
  if (params.city) {
    and.push({ city: { equals: params.city, mode: Prisma.QueryMode.insensitive } });
  }
  if (params.since) {
    and.push({ createdAt: { gte: params.since } });
  }
  return and.length > 0 ? { AND: and } : {};
}

function buildExploreCarsWhere(params: {
  query: string | null;
  stage: string | null;
  ownerUsername: string | null;
}): Prisma.CarWhereInput {
  const and: Prisma.CarWhereInput[] = [];
  if (params.query) {
    and.push({
      OR: [
        { nickname: { contains: params.query, mode: Prisma.QueryMode.insensitive } },
        { brand: { contains: params.query, mode: Prisma.QueryMode.insensitive } },
        { model: { contains: params.query, mode: Prisma.QueryMode.insensitive } },
      ],
    });
  }
  if (params.ownerUsername) {
    and.push({ garage: { user: { username: params.ownerUsername } } });
  }
  if (params.stage) {
    and.push({
      specifications: { some: { definition: { key: "stage" }, valueString: params.stage } },
    });
  }
  return and.length > 0 ? { AND: and } : {};
}

export class DiscoveryRepository {
  // ── Feed ──────────────────────────────────────────────────────────────────
  listRecentCars(limit: number): Promise<CarWithCover[]> {
    return prisma.car.findMany({
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: carWithCoverInclude,
    });
  }

  listRecentSightings(limit: number): Promise<SightingWithRelations[]> {
    return prisma.sighting.findMany({
      take: limit,
      orderBy: { occurredAt: "desc" },
      include: sightingWithRelationsInclude,
    });
  }

  listFollowingIds(followerId: string): Promise<string[]> {
    return prisma.follow
      .findMany({ where: { followerId }, select: { followingId: true } })
      .then((rows) => rows.map((row) => row.followingId));
  }

  listSightingsByAuthors(authorIds: string[], limit: number): Promise<SightingWithRelations[]> {
    if (authorIds.length === 0) {
      return Promise.resolve([]);
    }
    return prisma.sighting.findMany({
      where: { userId: { in: authorIds } },
      take: limit,
      orderBy: { occurredAt: "desc" },
      include: sightingWithRelationsInclude,
    });
  }

  // ── Ranking ───────────────────────────────────────────────────────────────
  listCarsRanked(
    orderBy: Prisma.CarOrderByWithRelationInput[],
    take: number,
  ): Promise<CarWithOwner[]> {
    return prisma.car.findMany({ take, orderBy, include: carWithOwnerInclude });
  }

  // ── Search (substring, case-insensitive) ────────────────────────────────
  searchPeople(query: string, limit: number): Promise<Array<User & { avatar: Upload | null }>> {
    return prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { city: { contains: query, mode: Prisma.QueryMode.insensitive } },
        ],
      },
      take: limit,
      include: { avatar: true },
    });
  }

  searchCars(query: string, limit: number): Promise<CarWithCover[]> {
    return prisma.car.findMany({
      where: {
        OR: [
          { nickname: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { brand: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { model: { contains: query, mode: Prisma.QueryMode.insensitive } },
        ],
      },
      take: limit,
      include: carWithCoverInclude,
    });
  }

  searchSightings(query: string, limit: number): Promise<SightingWithRelations[]> {
    return prisma.sighting.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { description: { contains: query, mode: Prisma.QueryMode.insensitive } },
        ],
      },
      take: limit,
      include: sightingWithRelationsInclude,
    });
  }

  // ── Explore: Pessoas ─────────────────────────────────────────────────────
  async listExplorePeople(params: {
    query: string | null;
    city: string | null;
    since: Date | null;
    sort: "RECENT" | "FOLLOWERS";
    cursor: string | null;
    limit: number;
  }): Promise<UserWithFollowerCount[]> {
    const where = buildExplorePeopleWhere(params);
    const orderBy: Prisma.UserOrderByWithRelationInput[] =
      params.sort === "FOLLOWERS"
        ? [{ followers: { _count: "desc" } }, { id: "desc" }]
        : [{ createdAt: "desc" }, { id: "desc" }];

    return prisma.user.findMany({
      where,
      orderBy,
      take: params.limit + 1,
      ...(params.cursor ? { cursor: { id: params.cursor }, skip: 1 } : {}),
      include: { avatar: true, _count: { select: { followers: true } } },
    });
  }

  countCarsByOwnerIds(userIds: string[]): Promise<Map<string, number>> {
    if (userIds.length === 0) {
      return Promise.resolve(new Map());
    }
    return prisma.garage
      .findMany({
        where: { userId: { in: userIds } },
        select: { userId: true, _count: { select: { cars: true } } },
      })
      .then((rows) => {
        const map = new Map<string, number>();
        for (const row of rows) {
          map.set(row.userId, (map.get(row.userId) ?? 0) + row._count.cars);
        }
        return map;
      });
  }

  listFollowedIds(followerId: string, targetIds: string[]): Promise<Set<string>> {
    if (targetIds.length === 0) {
      return Promise.resolve(new Set());
    }
    return prisma.follow
      .findMany({
        where: { followerId, followingId: { in: targetIds } },
        select: { followingId: true },
      })
      .then((rows) => new Set(rows.map((row) => row.followingId)));
  }

  // ── Explore: Carros ──────────────────────────────────────────────────────
  listExploreCars(params: {
    query: string | null;
    stage: string | null;
    ownerUsername: string | null;
    sort: "NEWEST" | "MOST_POWERFUL" | "LIGHTEST";
    cursor: string | null;
    limit: number;
  }): Promise<CarWithOwner[]> {
    const where = buildExploreCarsWhere(params);
    const orderBy: Prisma.CarOrderByWithRelationInput[] =
      params.sort === "MOST_POWERFUL"
        ? [{ horsepowerHp: "desc" }, { id: "desc" }]
        : params.sort === "LIGHTEST"
          ? [{ weightKg: "asc" }, { id: "desc" }]
          : [{ createdAt: "desc" }, { id: "desc" }];

    return prisma.car.findMany({
      where,
      orderBy,
      take: params.limit + 1,
      ...(params.cursor ? { cursor: { id: params.cursor }, skip: 1 } : {}),
      include: carWithOwnerInclude,
    });
  }
}

export const discoveryRepository = new DiscoveryRepository();
