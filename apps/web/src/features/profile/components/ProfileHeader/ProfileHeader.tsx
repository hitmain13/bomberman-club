import { Avatar } from "@/components/atoms/Avatar";
import { cn } from "@/shared/utils/cn";

import { styles } from "./ProfileHeader.styles";
import type { ProfileHeaderProps } from "./ProfileHeader.types";

export function ProfileHeader({
  profile,
  primaryAction,
  secondaryAction,
  className,
}: ProfileHeaderProps): JSX.Element {
  const displayName = profile.displayName ?? profile.username;
  return (
    <section className={cn(styles.root, className)}>
      <Avatar src={profile.avatarUrl} alt={displayName} size="xl" />
      <div className={styles.identity}>
        <h1 className={styles.name}>{displayName}</h1>
        <p className={styles.handle}>@{profile.username}</p>
        {profile.city ? <p className={styles.city}>{profile.city}</p> : null}
      </div>
      {profile.bio ? <p className={styles.bio}>{profile.bio}</p> : null}
      {primaryAction || secondaryAction ? (
        <div className={styles.actions}>
          {primaryAction}
          {secondaryAction}
        </div>
      ) : null}
    </section>
  );
}
