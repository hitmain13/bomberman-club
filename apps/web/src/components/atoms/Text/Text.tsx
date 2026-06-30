import { cn } from "@/shared/utils/cn";

import { textTones, textVariants } from "./Text.styles";
import type { TextProps } from "./Text.types";

export function Text({
  as: Component = "p",
  variant = "body",
  tone = "primary",
  className,
  children,
  ...rest
}: TextProps): JSX.Element {
  return (
    <Component className={cn(textVariants[variant], textTones[tone], className)} {...rest}>
      {children}
    </Component>
  );
}
