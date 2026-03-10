export type TBadgeColor =
  | "neutral"
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "error";

export type TStatusConfig = {
  label: string;
  color: TBadgeColor;
  short?: string;
};
