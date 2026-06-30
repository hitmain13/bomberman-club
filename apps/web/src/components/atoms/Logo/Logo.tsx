import { cn } from "@/shared/utils/cn";

import { logoSizes } from "./Logo.styles";
import type { LogoProps } from "./Logo.types";

export function Logo({ size = "md", withText = true, className }: LogoProps): JSX.Element {
  const sizing = logoSizes[size];
  return (
    <div className={cn("inline-flex items-center gap-3", className)} aria-label="Bomberman Club">
      <svg
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("text-fg-primary", sizing.mark)}
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>Logo Bomberman Club — turbocompressor</title>

        {/* intake pipe (entrada de ar, esquerda) */}
        <path d="M4 26 h10 v12 h-10 a2 2 0 0 1 -2 -2 v-8 a2 2 0 0 1 2 -2 z" />
        <path d="M6 30 h8 M6 34 h8" strokeWidth="1.5" />

        {/* snail/voluta principal (carcaça do compressor) */}
        <path d="M14 18 a18 18 0 1 0 0 28 z" />
        {/* segunda volta da espiral, indicando o caracol */}
        <path d="M22 22 a10 10 0 1 0 0 20" strokeWidth="1.8" opacity="0.55" />

        {/* hub central (eixo) */}
        <circle cx="34" cy="32" r="4" fill="currentColor" stroke="none" />
        <circle cx="34" cy="32" r="11" />

        {/* compressor blades (8 palhetas curvas radiais) */}
        <path d="M34 22 q 3 4 0 10" strokeWidth="1.8" />
        <path d="M41 24.5 q -1 5 -7 7.5" strokeWidth="1.8" />
        <path d="M44 32 q -5 -1 -10 0" strokeWidth="1.8" />
        <path d="M41 39.5 q -1 -5 -7 -7.5" strokeWidth="1.8" />
        <path d="M34 42 q 3 -4 0 -10" strokeWidth="1.8" />
        <path d="M27 39.5 q 1 -5 7 -7.5" strokeWidth="1.8" />
        <path d="M24 32 q 5 1 10 0" strokeWidth="1.8" />
        <path d="M27 24.5 q 1 5 7 7.5" strokeWidth="1.8" />

        {/* exhaust outlet (saída pressurizada, topo direito) */}
        <path d="M44 14 h12 a2 2 0 0 1 2 2 v6 a2 2 0 0 1 -2 2 h-10 z" />
        <path d="M48 18 h8 M48 21 h8" strokeWidth="1.5" />

        {/* boost lines (vapor saindo) */}
        <path d="M58 10 q 3 -2 3 -5" opacity="0.65" />
        <path d="M52 7 q 1 -3 4 -4" opacity="0.65" />
      </svg>
      {withText ? (
        <span className={cn("font-bold tracking-tight uppercase", sizing.text)}>
          Bomberman <span className="text-fg-secondary">Club</span>
        </span>
      ) : null}
    </div>
  );
}
