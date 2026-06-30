import type { SpecDefinition, SpecValueInput } from "@bomberman/types";

export interface SetCarSpecFormProps {
  definitions: ReadonlyArray<SpecDefinition>;
  onSubmit: (input: SpecValueInput) => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}
