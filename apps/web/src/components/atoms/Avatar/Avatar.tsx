import Image from "next/image";

import { cn } from "@/shared/utils/cn";

import { avatarSizes } from "./Avatar.styles";
import type { AvatarProps } from "./Avatar.types";

function getInitials(alt: string): string {
  const parts = alt.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0]?.slice(0, 2).toUpperCase() ?? "?";
  }
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

export function Avatar({ src, alt, size = "md", className }: AvatarProps): JSX.Element {
  if (!src) {
    return (
      <span
        aria-label={alt}
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-bg-elevated text-fg-secondary font-medium",
          avatarSizes[size],
          className,
        )}
      >
        {getInitials(alt)}
      </span>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={96}
      height={96}
      className={cn(
        "inline-block rounded-full object-cover bg-bg-elevated",
        avatarSizes[size],
        className,
      )}
    />
  );
}
