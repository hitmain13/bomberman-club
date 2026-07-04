import type { BottomNavItem } from "@/components/organisms/BottomNav";

export const BOTTOM_NAV_ITEMS: ReadonlyArray<BottomNavItem> = [
  { href: "/feed", label: "Início", icon: "home" },
  { href: "/explore", label: "Explorar", icon: "explore" },
  { href: "/sightings/new?capture=1", label: "Novo", icon: "plus", emphasized: true },
  { href: "/map", label: "Mapa", icon: "map" },
  { href: "/me", label: "Perfil", icon: "user" },
];
