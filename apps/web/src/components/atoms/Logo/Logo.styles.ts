import type { LogoSize } from "./Logo.types";

export const logoSizes: Record<LogoSize, { mark: string; text: string }> = {
  sm: { mark: "h-6 w-6", text: "text-base" },
  md: { mark: "h-8 w-8", text: "text-lg" },
  lg: { mark: "h-12 w-12", text: "text-xl" },
  xl: { mark: "h-24 w-24", text: "text-3xl" },
};
