export interface ProfileStatsValue {
  label: string;
  value: number;
}

export interface ProfileStatsProps {
  items: ReadonlyArray<ProfileStatsValue>;
  className?: string;
}
