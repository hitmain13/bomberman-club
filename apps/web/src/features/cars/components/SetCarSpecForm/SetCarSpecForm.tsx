"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/atoms/Button";

import { styles } from "./SetCarSpecForm.styles";
import type { SetCarSpecFormProps } from "./SetCarSpecForm.types";

type RawValue = string | boolean;

function parseValue(
  raw: RawValue,
  type: "STRING" | "NUMBER" | "BOOLEAN" | "ENUM",
): string | number | boolean | null {
  if (type === "BOOLEAN") {
    return Boolean(raw);
  }
  if (type === "NUMBER") {
    const value = Number.parseFloat(String(raw));
    return Number.isFinite(value) ? value : null;
  }
  return String(raw);
}

export function SetCarSpecForm({
  definitions,
  onSubmit,
  isSubmitting = false,
  errorMessage = null,
}: SetCarSpecFormProps): JSX.Element {
  const [definitionId, setDefinitionId] = useState<string>(definitions[0]?.id ?? "");
  const [rawValue, setRawValue] = useState<RawValue>("");

  const definition = useMemo(
    () => definitions.find((item) => item.id === definitionId),
    [definitions, definitionId],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!definition) {
      return;
    }
    const parsed = parseValue(rawValue, definition.type);
    if (parsed === null || parsed === "") {
      return;
    }
    onSubmit({ definitionId: definition.id, value: parsed });
  };

  return (
    <form className={styles.root} onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="spec-definition" className={styles.label}>
          Especificação
        </label>
        <select
          id="spec-definition"
          className={styles.control}
          value={definitionId}
          onChange={(event) => {
            setDefinitionId(event.target.value);
            setRawValue("");
          }}
        >
          {definitions.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
              {item.unit ? ` (${item.unit})` : ""}
            </option>
          ))}
        </select>
      </div>

      {definition ? (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="spec-value" className={styles.label}>
            Valor
          </label>
          {definition.type === "ENUM" && definition.enumOptions ? (
            <select
              id="spec-value"
              className={styles.control}
              value={typeof rawValue === "string" ? rawValue : ""}
              onChange={(event) => setRawValue(event.target.value)}
            >
              <option value="">Selecione</option>
              {definition.enumOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : definition.type === "BOOLEAN" ? (
            <label className={styles.inline}>
              <input
                type="checkbox"
                checked={Boolean(rawValue)}
                onChange={(event) => setRawValue(event.target.checked)}
              />
              {definition.name}
            </label>
          ) : (
            <input
              id="spec-value"
              className={styles.control}
              type={definition.type === "NUMBER" ? "number" : "text"}
              inputMode={definition.type === "NUMBER" ? "decimal" : "text"}
              value={typeof rawValue === "string" ? rawValue : ""}
              onChange={(event) => setRawValue(event.target.value)}
            />
          )}
        </div>
      ) : null}

      {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

      <Button type="submit" fullWidth isLoading={isSubmitting}>
        Salvar
      </Button>
    </form>
  );
}
