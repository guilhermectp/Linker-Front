import * as z from "zod";
import {
  clientCreateAddressSchema,
  clientCreatePlanSchema,
} from "./client.create";

export const clientUpdateInfoSchema = z.object({
  cpf: z.string().length(14, "O CPF deve ter 11 dígitos"),
  nome: z.string().trim().min(2, "Nome é obrigatório"),
  email: z.email("E-mail inválido"),
  telefone: z.string().length(15, "O telefone deve conter 10 dígitos"),
});

export const clientUpdatePasswordSchema = z.object({
  senhaCentralCliente: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres"),
});

const clientUpdateConnectionPointSchema = z.object({
  ponto: z.object({
    ...clientCreatePlanSchema.shape.ponto.shape,
    ...clientCreateAddressSchema.shape.ponto.shape,
  }),
});

export type TClientUpdateInfo = z.infer<typeof clientUpdateInfoSchema>;
export type TClientUpdatePassword = z.infer<typeof clientUpdatePasswordSchema>;
export type TClientUpdateConnectionPoint = z.infer<
  typeof clientUpdateConnectionPointSchema
>;
