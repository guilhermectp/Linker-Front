import type { PaginatedRequest } from "./requests";

export interface FetchPlanos extends PaginatedRequest<Plano[]> {}

export type Plano = {
  id: string;
  nome: string;
  uploadMB: number;
  downloadMB: number;
  valor: number;
  descricao: string;
};
