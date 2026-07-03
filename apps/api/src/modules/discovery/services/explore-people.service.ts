import type { ExplorePeopleResponse, PeopleSort } from "@bomberman/types";

import { toExplorePerson } from "../mappers/explore.mapper";
import { discoveryRepository } from "../repositories/discovery.repository";

export interface ExplorePeopleParams {
  viewerId: string;
  query: string | null;
  city: string | null;
  since: Date | null;
  sort: PeopleSort;
  cursor: string | null;
  limit: number;
}

export class ExplorePeopleService {
  async list(params: ExplorePeopleParams): Promise<ExplorePeopleResponse> {
    const rows = await discoveryRepository.listExplorePeople(params);
    const hasMore = rows.length > params.limit;
    const page = hasMore ? rows.slice(0, params.limit) : rows;

    const userIds = page.map((user) => user.id);
    const [carsCountByUser, followedIds] = await Promise.all([
      discoveryRepository.countCarsByOwnerIds(userIds),
      discoveryRepository.listFollowedIds(params.viewerId, userIds),
    ]);

    const items = page.map((user) =>
      toExplorePerson(user, carsCountByUser.get(user.id) ?? 0, followedIds.has(user.id)),
    );

    const last = page.at(-1);
    return { items, nextCursor: hasMore && last ? last.id : null };
  }
}

export const explorePeopleService = new ExplorePeopleService();
