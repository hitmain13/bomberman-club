import type { MemberSinceOption } from "./PeopleFiltersSheet.types";

export function memberSinceToIso(
  option: MemberSinceOption,
  now: Date = new Date(),
): string | undefined {
  if (option === "LAST_30_DAYS") {
    return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  }
  if (option === "THIS_YEAR") {
    return new Date(now.getFullYear(), 0, 1).toISOString();
  }
  return undefined;
}
