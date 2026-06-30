const RELATIVE = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
const DATE = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
const DATE_TIME = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatRelative(date: Date | string): string {
  const target = typeof date === "string" ? new Date(date) : date;
  const diff = target.getTime() - Date.now();
  const minutes = Math.round(diff / 60_000);
  if (Math.abs(minutes) < 60) {
    return RELATIVE.format(minutes, "minute");
  }
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) {
    return RELATIVE.format(hours, "hour");
  }
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 30) {
    return RELATIVE.format(days, "day");
  }
  return DATE.format(target);
}

export function formatDate(date: Date | string): string {
  const target = typeof date === "string" ? new Date(date) : date;
  return DATE.format(target);
}

export function formatDateTime(date: Date | string): string {
  const target = typeof date === "string" ? new Date(date) : date;
  return DATE_TIME.format(target);
}
