import type { TStatusConfig } from "~/types/badgeColors";
import type { TClienteStatus } from "~/types/clients";

export const ENUM_STATUS_CLIENT: Record<TClienteStatus, string> = {
  ATIVO: "ATIVO",
  SUSPENSO: "SUSPENSO",
  INATIVO: "INATIVO",
};

export const STATUS_CLIENT: Record<TClienteStatus, TStatusConfig> = {
  ATIVO: {
    label: "Ativo",
    color: "primary",
  },
  SUSPENSO: {
    label: "Suspenso",
    color: "warning",
  },
  INATIVO: {
    label: "Desativado",
    color: "neutral",
  },
};
