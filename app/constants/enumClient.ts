type BadgeColor = "neutral" | "primary";

type StatusConfig = {
  label: string;
  color: BadgeColor;
};

export const STATUS_CLIENT: Record<string, StatusConfig> = {
  ATIVO: {
    label: "Ativo",
    color: "primary",
  },
  DESATIVADO: {
    label: "Desativado",
    color: "neutral",
  },
};
