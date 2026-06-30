import { breakpoints } from "./breakpoints";
import { colors } from "./colors";
import { radius, spacing } from "./spacing";
import { typography } from "./typography";
import { zIndex } from "./z-index";

export const tailwindTheme = {
  screens: breakpoints,
  colors: {
    bg: colors.bg,
    fg: colors.fg,
    border: colors.border,
    accent: colors.accent,
    transparent: "transparent",
    current: "currentColor",
  },
  spacing,
  borderRadius: radius,
  fontFamily: typography.fontFamily,
  fontSize: typography.fontSize,
  lineHeight: typography.lineHeight,
  fontWeight: typography.fontWeight,
  zIndex,
} as const;

export type TailwindTheme = typeof tailwindTheme;
