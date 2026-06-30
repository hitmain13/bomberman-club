export const shadows = {
  sm: "0 1px 2px 0 rgba(0,0,0,0.4)",
  md: "0 4px 8px -2px rgba(0,0,0,0.45)",
  lg: "0 12px 24px -8px rgba(0,0,0,0.55)",
  bottomNav: "0 -6px 16px -8px rgba(0,0,0,0.55)",
} as const;

export type ShadowTokens = typeof shadows;
