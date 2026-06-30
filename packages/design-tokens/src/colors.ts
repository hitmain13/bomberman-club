export const colors = {
  bg: {
    base: "#0B0B0F",
    surface: "#14141B",
    elevated: "#1C1C26",
    muted: "#23232F",
  },
  fg: {
    primary: "#F5F5F7",
    secondary: "#B6B6C2",
    muted: "#7A7A86",
    inverted: "#0B0B0F",
  },
  border: {
    subtle: "#23232F",
    default: "#2E2E3A",
    strong: "#3A3A48",
  },
  accent: {
    primary: "#F5F5F7",
    primaryFg: "#0B0B0F",
    danger: "#E5484D",
    success: "#30A46C",
    warning: "#F1A10D",
    info: "#3E63DD",
  },
} as const;

export type ColorTokens = typeof colors;
