export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  src: string | null;
  alt: string;
  size?: AvatarSize;
  className?: string;
}
