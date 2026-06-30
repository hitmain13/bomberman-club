import { cn } from "@/shared/utils/cn";

import { logoSizes } from "./Logo.styles";
import type { LogoProps } from "./Logo.types";

export function Logo({ size = "md", withText = true, className }: LogoProps): JSX.Element {
  const sizing = logoSizes[size];
  return (
    <div className={cn("inline-flex items-center gap-3", className)} aria-label="Bomberman Club">
      <svg
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("text-fg-primary", sizing.mark)}
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="24" cy="24" r="9" fill="none" stroke="currentColor" strokeWidth="3" />
        <path
          d="M24 4 v8 M24 36 v8 M4 24 h8 M36 24 h8"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      {withText ? (
        <span className={cn("font-bold tracking-tight uppercase", sizing.text)}>
          Bomberman <span className="text-fg-secondary">Club</span>
        </span>
      ) : null}
    </div>
  );
}
