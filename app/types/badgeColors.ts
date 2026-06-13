export type UINuxtColors =
  | "neutral"
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "error";

export type StatusConfig = {
  label: string;
  color: UINuxtColors;
  short?: string;
};
