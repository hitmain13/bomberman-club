import type { CarsSort, ExploreCarsResponse } from "@bomberman/types";

import { toExploreCar } from "../mappers/explore.mapper";
import { discoveryRepository } from "../repositories/discovery.repository";

export interface ExploreCarsParams {
  query: string | null;
  stage: string | null;
  ownerUsername: string | null;
  sort: CarsSort;
  cursor: string | null;
  limit: number;
}

export class ExploreCarsService {
  async list(params: ExploreCarsParams): Promise<ExploreCarsResponse> {
    const rows = await discoveryRepository.listExploreCars(params);
    const hasMore = rows.length > params.limit;
    const page = hasMore ? rows.slice(0, params.limit) : rows;
    const items = page.map(toExploreCar);
    const last = page.at(-1);
    return { items, nextCursor: hasMore && last ? last.id : null };
  }
}

export const exploreCarsService = new ExploreCarsService();
