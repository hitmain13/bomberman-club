import { cn } from "@/shared/utils/cn";

import { badgeBase, badgeVariants } from "./Badge.styles";
import type { BadgeProps } from "./Badge.types";

export function Badge({
  variant = "neutral",
  className,
  children,
  ...rest
}: BadgeProps): JSX.Element {
  return (
    <span className={cn(badgeBase, badgeVariants[variant], className)} {...rest}>
      {children}
    </span>
  );
}
