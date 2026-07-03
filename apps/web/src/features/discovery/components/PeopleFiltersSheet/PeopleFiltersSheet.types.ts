import type { PeopleSort } from "@bomberman/types";

export type MemberSinceOption = "ALL" | "LAST_30_DAYS" | "THIS_YEAR";

export interface PeopleFiltersValue {
  city: string;
  sort: PeopleSort;
  memberSince: MemberSinceOption;
}

export interface PeopleFiltersSheetProps {
  open: boolean;
  value: PeopleFiltersValue;
  onClose: () => void;
  onApply: (value: PeopleFiltersValue) => void;
  onClear: () => void;
}
