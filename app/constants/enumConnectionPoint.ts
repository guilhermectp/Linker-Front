import type { TStatusConfig } from "~/types/badgeColors";
import type { TPontoConexaoStatus } from "~/types/connectionPoint";

export const ENUM_STATUS_POINT: Record<TPontoConexaoStatus, string> = {
  ATIVO: "ATIVO",
  REDUZIDO: "REDUZIDO",
  BLOQUEADO: "BLOQUEADO",
  CANCELADO: "CANCELADO",
};

export const STATUS_POINT: Record<TPontoConexaoStatus, TStatusConfig> = {
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
