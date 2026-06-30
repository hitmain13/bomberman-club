import { BottomNav } from "@/components/organisms/BottomNav";
import { BOTTOM_NAV_ITEMS } from "@/shared/constants/navigation";

import { styles } from "./AppShell.styles";
import type { AppShellProps } from "./AppShell.types";

export function AppShell({ children, hideBottomNav = false }: AppShellProps): JSX.Element {
  return (
    <div className={styles.root}>
      <main className={hideBottomNav ? styles.mainNoNav : styles.main}>{children}</main>
      {hideBottomNav ? null : <BottomNav items={BOTTOM_NAV_ITEMS} />}
    </div>
  );
}
