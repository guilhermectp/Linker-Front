type BadgeColor =
  | "neutral"
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "error";

type StatusConfig = {
  label: string;
  color: BadgeColor;
  short: string;
};

export const STATUS_POINT: Record<string, StatusConfig> = {
  ATIVO: {
    label: "Ativo",
    color: "primary",
    short: "A",
  },
  REDUZIDO: {
    label: "Reduzido",
    color: "warning",
    short: "R",
  },
  BLOQUEADO: {
    label: "Bloqueado",
    color: "error",
    short: "B",
  },
  CANCELADO: {
    label: "Cancelado",
    color: "neutral",
    short: "C",
  },
};
