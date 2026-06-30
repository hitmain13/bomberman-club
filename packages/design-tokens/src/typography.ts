export const typography = {
  fontFamily: {
    sans: "'Inter', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
  },
  fontSize: {
    xs: "12px",
    sm: "14px",
    base: "15px",
    md: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px",
    "4xl": "36px",
  },
  lineHeight: {
    tight: "1.15",
    snug: "1.3",
    normal: "1.5",
    relaxed: "1.65",
  },
  fontWeight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;

export type TypographyTokens = typeof typography;
