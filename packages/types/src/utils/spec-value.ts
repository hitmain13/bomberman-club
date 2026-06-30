import type { SpecDefinition, SpecValueResponse } from "../schemas/specification";

export type ResolvedSpecValue = string | number | boolean;

export function resolveSpecValue(value: SpecValueResponse): ResolvedSpecValue | null {
  if (value.definition.type === "STRING" || value.definition.type === "ENUM") {
    return value.valueString;
  }
  if (value.definition.type === "NUMBER") {
    return value.valueNumber;
  }
  return value.valueBoolean;
}

export function formatSpecValue(value: SpecValueResponse): string {
  const resolved = resolveSpecValue(value);
  if (resolved === null || resolved === undefined) {
    return "—";
  }
  if (typeof resolved === "boolean") {
    return resolved ? "Sim" : "Não";
  }
  if (typeof resolved === "number" && value.definition.unit) {
    return `${resolved} ${value.definition.unit}`;
  }
  return String(resolved);
}

export function validateSpecValueInput(
  definition: SpecDefinition,
  value: ResolvedSpecValue,
): { ok: true } | { ok: false; message: string } {
  if (definition.type === "BOOLEAN") {
    if (typeof value !== "boolean") {
      return { ok: false, message: `${definition.name} deve ser true/false.` };
    }
    return { ok: true };
  }
  if (definition.type === "NUMBER") {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return { ok: false, message: `${definition.name} deve ser numérico.` };
    }
    return { ok: true };
  }
  if (definition.type === "ENUM") {
    if (typeof value !== "string") {
      return { ok: false, message: `${definition.name} deve ser texto.` };
    }
    if (!definition.enumOptions?.includes(value)) {
      return { ok: false, message: `${definition.name} aceita apenas valores predefinidos.` };
    }
    return { ok: true };
  }
  if (typeof value !== "string") {
    return { ok: false, message: `${definition.name} deve ser texto.` };
  }
  return { ok: true };
}
