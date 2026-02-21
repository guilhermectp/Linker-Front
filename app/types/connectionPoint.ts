import type { TPlan } from "./plan";

export type TPontoConexaoStatus =
  | "ATIVO"
  | "REDUZIDO"
  | "BLOQUEADO"
  | "CANCELADO";

export type TTipoEndereco = "URBANO" | "RURAL";

export type TEnderecoBase = {
  tipoEndereco: TTipoEndereco;
  latitude?: string;
  longitude?: string;
  complemento?: string;
};

export type TEnderecoUrbano = TEnderecoBase & {
  tipoEndereco: "URBANO";
  cep: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: number;
};

export type TEnderecoRural = TEnderecoBase & {
  tipoEndereco: "RURAL";
  cidadeReferencia: string;
  nomeLocal: string;
};

export type TGetPontoConexao = {
  id: string;
  status: TPontoConexaoStatus;
  diaVencimento: number;
  diaUltimoPagamento: string;
  loginMK: string;
  senhaMK: string;
  plano: TPlan;
  endereco: TEnderecoUrbano | TEnderecoRural;
};

export type TFormPontoConexao = {
  pontoId?: string;
  planoId: string;
  diaVencimento: number;
  loginMK: string;
  senhaMK?: string;
};

export type TFormEndereco = { pontoId?: string } & (
  | TEnderecoUrbano
  | TEnderecoRural
);
