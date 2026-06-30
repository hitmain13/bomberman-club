import type { ReactNode } from "react";

export interface ProfileSummary {
  username: string;
  displayName?: string | null;
  avatarUrl: string | null;
  city: string | null;
  bio: string | null;
}

export interface ProfileHeaderProps {
  profile: ProfileSummary;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
}
