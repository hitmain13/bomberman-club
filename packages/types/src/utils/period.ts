import type { SightingPeriod } from "../enums/sighting-period";

const DAY = 24 * 60 * 60 * 1000;

export function periodStartDate(period: SightingPeriod, now: Date = new Date()): Date | null {
  if (period === "ALL") {
    return null;
  }
  if (period === "TODAY") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (period === "WEEK") {
    return new Date(now.getTime() - 7 * DAY);
  }
  if (period === "MONTH") {
    return new Date(now.getTime() - 30 * DAY);
  }
  return new Date(now.getTime() - 365 * DAY);
}
