interface CarMetricsInput {
  weightKg: number;
  horsepowerHp: number;
  torqueNm: number;
}

export interface CarMetrics {
  weightToPowerKgPerHp: number;
  powerToWeightHpPerTon: number;
  torqueToWeightNmPerTon: number;
}

const HP_TO_KW = 0.7457;

export function calculateCarMetrics(input: CarMetricsInput): CarMetrics {
  if (input.horsepowerHp <= 0 || input.weightKg <= 0) {
    return { weightToPowerKgPerHp: 0, powerToWeightHpPerTon: 0, torqueToWeightNmPerTon: 0 };
  }

  const weightToPowerKgPerHp = round(input.weightKg / input.horsepowerHp, 2);
  const powerToWeightHpPerTon = round(input.horsepowerHp / (input.weightKg / 1000), 1);
  const torqueToWeightNmPerTon = round(input.torqueNm / (input.weightKg / 1000), 1);

  return { weightToPowerKgPerHp, powerToWeightHpPerTon, torqueToWeightNmPerTon };
}

export function horsepowerToKw(hp: number): number {
  return round(hp * HP_TO_KW, 1);
}

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
