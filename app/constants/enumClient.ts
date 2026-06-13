import type { StatusConfig } from "~/types/badgeColors";
import type { ClienteStatus } from "~/types/clients";

export const ENUM_STATUS_CLIENT: Record<ClienteStatus, string> = {
  ATIVO: "ATIVO",
  SUSPENSO: "SUSPENSO",
  INATIVO: "INATIVO",
};

export const STATUS_CLIENT: Record<ClienteStatus, StatusConfig> = {
  ATIVO: {
    label: "Ativo",
    color: "success",
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
