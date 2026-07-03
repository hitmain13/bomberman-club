import type { ReactNode } from "react";

export type ProfileTabId = "about" | "cars" | "sightings" | "gallery" | "likes";

export interface ProfileTab {
  id: ProfileTabId;
  label: string;
  content: ReactNode;
}

export interface ProfileTabsProps {
  tabs: ReadonlyArray<ProfileTab>;
  defaultTabId?: ProfileTabId;
  className?: string;
}
