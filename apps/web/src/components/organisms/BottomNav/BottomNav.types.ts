import type { IconName } from "@/components/atoms/Icon";

export interface BottomNavItem {
  href: string;
  label: string;
  icon: IconName;
  emphasized?: boolean;
}

export interface BottomNavProps {
  items: ReadonlyArray<BottomNavItem>;
}
