import { forwardRef } from "react";

import { cn } from "@/shared/utils/cn";

import { inputBase, inputDefault, inputInvalid } from "./Input.styles";
import type { InputProps } from "./Input.types";

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid = false, className, type = "text", ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(inputBase, invalid ? inputInvalid : inputDefault, className)}
      {...rest}
    />
  );
});
