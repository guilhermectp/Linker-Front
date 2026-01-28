import type { TPontoConexao } from "./connectionPoint";

export type TClientStatus = "ATIVO" | "DESATIVADO";

export type TClient = {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senhaCentralCliente: string;
  status: TClientStatus;
  pontos: TPontoConexao[];
};
