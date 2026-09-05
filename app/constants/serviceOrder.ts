import type {
  IServiceOrderUIMap,
  TServiceOrderStatus,
  TServiceOrderType,
} from "~/types/serviceOrder";
import type { StatusConfig } from "~/types/ui";

export const SERVICE_TYPE: Record<TServiceOrderType, IServiceOrderUIMap> = {
  INSTALACAO: {
    label: "Instalação",
    bg: "bg-success/10",
    icon: "i-lucide-wifi",
    iconColor: "text-success",
  },
  SUPORTE: {
    label: "Suporte",
    bg: "bg-accented",
    icon: "i-lucide-wrench",
    iconColor: "text-neutral",
  },
  CANCELAMENTO: {
    label: "Retirada",
    bg: "bg-error/10",
    icon: "i-lucide-package-minus",
    iconColor: "text-error",
  },
  TROCA_ENDERECO: {
    label: "Troca de Residência",
    bg: "bg-info/10",
    icon: "i-lucide-map-pin",
    iconColor: "text-info",
  },
};

export const SERVICE_STATUS: Record<TServiceOrderStatus, StatusConfig> = {
  EM_ANDAMENTO: { label: "Pendente", color: "warning" },
  FINALIZADA: { label: "Finalizada", color: "success" },
  CANCELADA: { label: "Cancelada", color: "error" },
};
