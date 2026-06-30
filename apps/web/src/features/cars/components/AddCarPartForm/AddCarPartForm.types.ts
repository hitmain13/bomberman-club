import type { CarPartInput } from "@bomberman/types";

export interface AddCarPartFormProps {
  onSubmit: (input: CarPartInput) => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}
