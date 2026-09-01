import type { TGetPontoConexao } from "./connectionPoint";
import type { PaginatedRequest } from "./requests";

export interface FetchClientes extends PaginatedRequest<Cliente[]> {}

export interface FetchClientesSeletor {
  data: Cliente[];
}

export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senhaCentralCliente: string;
  status: ClienteStatus;
  pontos: TGetPontoConexao[];
}

export type ClienteStatus = "ATIVO" | "SUSPENSO" | "INATIVO";

// Form Cliente
export type TFormCliente = {
  cpf?: string;
  nome: string;
  email: string;
  telefone: string;
  senhaCentralCliente?: string;
};
