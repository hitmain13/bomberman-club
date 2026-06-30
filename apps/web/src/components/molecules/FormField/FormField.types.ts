import type { InputHTMLAttributes, ReactNode } from "react";

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string | undefined;
  errorMessage?: string | undefined;
  trailing?: ReactNode;
}
