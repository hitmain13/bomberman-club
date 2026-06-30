import type { FeedScope } from "@bomberman/types";

export interface FeedTabsProps {
  value: FeedScope;
  onChange: (value: FeedScope) => void;
}
