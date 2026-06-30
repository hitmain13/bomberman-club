"use client";

import { useState } from "react";

import { cn } from "@/shared/utils/cn";

import { styles } from "./ProfileTabs.styles";
import type { ProfileTabId, ProfileTabsProps } from "./ProfileTabs.types";

export function ProfileTabs({ tabs, defaultTabId, className }: ProfileTabsProps): JSX.Element {
  const initial: ProfileTabId = defaultTabId ?? tabs[0]?.id ?? "cars";
  const [activeId, setActiveId] = useState<ProfileTabId>(initial);
  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];
  return (
    <div className={cn(styles.root, className)}>
      <div role="tablist" className={styles.list}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={cn(styles.tab, isActive && styles.tabActive)}
              onClick={() => setActiveId(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" className={styles.panel}>
        {activeTab?.content}
      </div>
    </div>
  );
}
