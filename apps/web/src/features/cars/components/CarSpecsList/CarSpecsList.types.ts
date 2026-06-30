import type { SpecValueResponse } from "@bomberman/types";

export interface CarSpecsListProps {
  specs: ReadonlyArray<SpecValueResponse>;
  className?: string;
}
