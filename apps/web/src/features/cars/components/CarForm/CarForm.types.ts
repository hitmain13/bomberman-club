import type { CarResponse } from "@bomberman/types";

export interface CarFormProps {
  garageId: string;
  initialCar?: CarResponse | undefined;
  onSubmit: (values: import("../../schemas").CarFormValues) => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}
