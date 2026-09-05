import type { Cliente } from "./clients";
import type { TGetPontoConexao } from "./connectionPoint";
import { type DateValue } from "@internationalized/date";

// Fetch / Get
export interface IServiceOrder {
  id: string;
  numeroOs: string;
  situacao: TServiceOrderStatus;
  tipo: TServiceOrderType;
  dataAbertura: string;
  dataAgendada: string;
  observacao: string;
  responsavelAbertura: string;
  tecnicoResponsavel: string;
  cliente: Omit<Cliente, "pontos">;
  local: TGetPontoConexao;
}

export type TServiceOrderType =
  | "INSTALACAO"
  | "SUPORTE"
  | "CANCELAMENTO"
  | "TROCA_ENDERECO";

export type TServiceOrderStatus = "EM_ANDAMENTO" | "FINALIZADA" | "CANCELADA";

// Post / Patch
export interface PostOrdemServico {
  idCliente: string;
  tipoServico: TServiceOrderType | undefined;
  observacao: string;
  dataAgendada: string; // ISO
}

// UI
export interface IServiceOrderUIMap {
  label: string;
  bg: string;
  icon: string;
  iconColor: string;
}

export interface FormOrdemServico {
  idCliente: string;
  idPontoConexao: string;
  tipoServico: TServiceOrderType | undefined;
  observacao: string;
  dataAgendada: DateValue | undefined;
}
