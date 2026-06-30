export type LogoSize = "sm" | "md" | "lg" | "xl";

export interface LogoProps {
  size?: LogoSize;
  withText?: boolean;
  className?: string;
}
