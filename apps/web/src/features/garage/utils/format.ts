const NUMBER_FORMAT = new Intl.NumberFormat("pt-BR");

export function formatKm(value: number): string {
  return `${NUMBER_FORMAT.format(value)} km`;
}

export function formatHp(value: number): string {
  return `${NUMBER_FORMAT.format(value)} cv`;
}

export function formatKg(value: number): string {
  return `${NUMBER_FORMAT.format(value)} kg`;
}

export function formatRatio(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
