"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/shared/utils/cn";

import { styles } from "./BottomNav.styles";
import type { BottomNavProps } from "./BottomNav.types";

function isActive(href: string, pathname: string): boolean {
  const path = href.split("?")[0] ?? href;
  if (path === "/") {
    return pathname === "/";
  }
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function BottomNav({ items }: BottomNavProps): JSX.Element {
  const pathname = usePathname();
  return (
    <nav className={styles.root} aria-label="Navegação principal">
      <ul className={styles.list}>
        {items.map((item) => {
          const active = isActive(item.href, pathname);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(styles.item, active && !item.emphasized && styles.itemActive)}
              >
                {item.emphasized ? (
                  <span className={styles.emphasized} aria-hidden="true">
                    <Icon name={item.icon} size="lg" />
                  </span>
                ) : (
                  <Icon name={item.icon} size="lg" aria-label={item.label} />
                )}
                {!item.emphasized ? <span>{item.label}</span> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
