import type { SightingInput } from "@bomberman/types";

export interface NewSightingFormProps {
  onSubmit: (input: SightingInput) => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}
