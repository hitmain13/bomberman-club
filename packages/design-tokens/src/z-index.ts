export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  bottomNav: 300,
  overlay: 400,
  modal: 500,
  popover: 600,
  toast: 700,
} as const;

export type ZIndexTokens = typeof zIndex;
