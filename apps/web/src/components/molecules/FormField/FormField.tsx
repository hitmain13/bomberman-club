import { forwardRef, useId } from "react";

import { Input } from "@/components/atoms/Input";
import { cn } from "@/shared/utils/cn";

import { styles } from "./FormField.styles";
import type { FormFieldProps } from "./FormField.types";

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField(
  { label, helperText, errorMessage, trailing, id, className, ...rest },
  ref,
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const describedById = errorMessage
    ? `${fieldId}-error`
    : helperText
      ? `${fieldId}-helper`
      : undefined;

  return (
    <div className={cn(styles.root, className)}>
      <label htmlFor={fieldId} className={styles.label}>
        {label}
      </label>
      <div className={styles.inputWrap}>
        <Input
          ref={ref}
          id={fieldId}
          invalid={Boolean(errorMessage)}
          aria-describedby={describedById}
          {...rest}
        />
        {trailing ? <span className={styles.trailing}>{trailing}</span> : null}
      </div>
      {errorMessage ? (
        <p id={`${fieldId}-error`} role="alert" className={styles.error}>
          {errorMessage}
        </p>
      ) : helperText ? (
        <p id={`${fieldId}-helper`} className={styles.helper}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
});
