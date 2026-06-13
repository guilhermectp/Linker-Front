import type { TGetPontoConexao } from "./connectionPoint";

// Tipagens de request

// export type FetchClient {
//   clientes: Client[];
//   count | totalPages | totalElements
// }

export type ClienteStatus = "ATIVO" | "SUSPENSO" | "INATIVO";

export type GetCliente = {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senhaCentralCliente: string;
  status: ClienteStatus;
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
