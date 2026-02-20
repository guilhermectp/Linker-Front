import type { TGetPontoConexao } from "./connectionPoint";

export type TClientStatus = "ATIVO" | "DESATIVADO";

export type TGetCliente = {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senhaCentralCliente: string;
  status: TClientStatus;
  pontos: TGetPontoConexao[];
};

export type TFormCliente = {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senhaCentralCliente?: string;
};
