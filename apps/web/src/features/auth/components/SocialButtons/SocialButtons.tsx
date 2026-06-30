"use client";

import { Button } from "@/components/atoms/Button";
import { cn } from "@/shared/utils/cn";

import { styles } from "./SocialButtons.styles";
import type { SocialButtonsProps } from "./SocialButtons.types";

export function SocialButtons({ disabled, className }: SocialButtonsProps): JSX.Element {
  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.divider} aria-hidden="true">
        <span className={styles.line} />
        ou
        <span className={styles.line} />
      </div>
      <Button variant="secondary" fullWidth disabled={disabled} aria-label="Continuar com Google">
        Continuar com Google
      </Button>
      <Button variant="secondary" fullWidth disabled={disabled} aria-label="Continuar com Apple">
        Continuar com Apple
      </Button>
    </div>
  );
}
