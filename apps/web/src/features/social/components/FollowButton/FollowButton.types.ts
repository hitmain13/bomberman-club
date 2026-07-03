export interface FollowButtonProps {
  username: string;
  initialFollowing?: boolean;
  onToggled?: (following: boolean) => void;
  className?: string;
}
