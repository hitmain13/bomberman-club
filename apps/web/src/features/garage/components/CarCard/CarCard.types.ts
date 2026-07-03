import type { CarResponse } from "@bomberman/types";

export interface CarCardOwner {
  username: string;
  avatarUrl: string | null;
}

export interface CarCardProps {
  car: CarResponse;
  owner?: CarCardOwner | undefined;
  href?: string | undefined;
  className?: string | undefined;
}
