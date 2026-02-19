import type { TGetPontoConexao } from "./connectionPoint";

export type TClientStatus = "ATIVO" | "DESATIVADO";

export type TGetCliente = {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  status: TClientStatus;
  pontos: TGetPontoConexao[];
};
