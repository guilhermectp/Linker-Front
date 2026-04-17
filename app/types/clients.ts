import type { TGetPontoConexao } from "./connectionPoint";

export type TClienteStatus = "ATIVO" | "SUSPENSO" | "INATIVO";

export type TGetCliente = {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senhaCentralCliente: string;
  status: TClienteStatus;
  pontos: TGetPontoConexao[];
};

// Form Cliente
export type TFormCliente = {
  cpf?: string;
  nome: string;
  email: string;
  telefone: string;
  senhaCentralCliente?: string;
};
