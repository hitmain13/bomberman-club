export const spacing = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
} as const;

export const radius = {
  none: "0px",
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "20px",
  pill: "9999px",
} as const;

export type SpacingTokens = typeof spacing;
export type RadiusTokens = typeof radius;
