import type { ElementType, HTMLAttributes, ReactNode } from "react";

export type TextVariant =
  | "display"
  | "title"
  | "subtitle"
  | "body"
  | "body-strong"
  | "caption"
  | "label"
  | "metric";

export type TextTone = "primary" | "secondary" | "muted" | "danger" | "success" | "warning";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: TextVariant;
  tone?: TextTone;
  children: ReactNode;
}
