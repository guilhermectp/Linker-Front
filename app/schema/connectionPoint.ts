import * as z from "zod";

const urbanAddressSchema = z.object({
  tipoEndereco: z.literal("URBANO"),
  cep: z.string().length(10, "CEP deve conter 8 dígitos"),
  cidade: z.string().min(2, "Cidade é obrigatória"),
  bairro: z.string().min(2, "Bairro é obrigatório"),
  rua: z.string().min(2, "Rua é obrigatório"),
  numero: z.number().int().positive("Número inválido"),
  complemento: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const ruralAddressSchema = z.object({
  tipoEndereco: z.literal("RURAL"),
  nomeLocal: z.string().min(2, "Nome do local é obrigatório"),
  cidadeReferencia: z
    .string()
    .min(2, "Referência de proximidade é obrigatório"),
  complemento: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const connectionPointAddressSchema = z.object({
  ponto: z.object({
    endereco: z.discriminatedUnion("tipoEndereco", [
      urbanAddressSchema,
      ruralAddressSchema,
    ]),
  }),
});

export const connectionPointPlanSchema = z.object({
  ponto: z.object({
    planoId: z.uuid("Plano inválido"),
    diaVencimento: z
      .number()
      .int()
      .min(1, "Dia mínimo é 1")
      .max(31, "Dia máximo é 31"),
    loginMK: z.string().min(8, "O login deve ter pelo menos 8 caracteres"),
    senhaMK: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
  }),
});

export const connectionPointFullSchema = z.object({
  ponto: z.object({
    ...connectionPointPlanSchema.shape.ponto.shape,
    ...connectionPointAddressSchema.shape.ponto.shape,
  }),
});

export type TUpdateConnectionPoint = z.infer<typeof connectionPointFullSchema>;
