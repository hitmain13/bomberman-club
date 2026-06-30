import { Logo } from "@/components/atoms/Logo";

import { styles } from "./AuthLayout.styles";
import type { AuthLayoutProps } from "./AuthLayout.types";

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps): JSX.Element {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Logo size="lg" withText={false} />
        <div className={styles.heading}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        </div>
      </header>
      <div className={styles.body}>{children}</div>
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </div>
  );
}
