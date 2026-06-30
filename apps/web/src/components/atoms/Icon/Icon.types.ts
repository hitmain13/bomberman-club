export type IconName =
  | "home"
  | "explore"
  | "plus"
  | "map"
  | "user"
  | "search"
  | "heart"
  | "comment"
  | "bookmark"
  | "settings"
  | "bell"
  | "camera"
  | "chevron-right"
  | "arrow-left"
  | "x";

export type IconSize = "sm" | "md" | "lg";

export interface IconProps {
  name: IconName;
  size?: IconSize;
  className?: string;
  "aria-label"?: string;
}
