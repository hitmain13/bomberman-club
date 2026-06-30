import { cn } from "@/shared/utils/cn";

import { spinnerSizes } from "./Spinner.styles";
import type { SpinnerProps } from "./Spinner.types";

export function Spinner({ size = "md", label, className }: SpinnerProps): JSX.Element {
  return (
    <span
      role="status"
      aria-label={label ?? "Carregando"}
      className={cn(
        "inline-block animate-spin rounded-full border-current border-t-transparent text-fg-secondary",
        spinnerSizes[size],
        className,
      )}
    />
  );
}
