import type {
  TConnectionPointAddress,
  TConnectionPointCreate,
  TConnectionPointPlan,
  TConnectionPointUpdateMicrotik,
} from "~/schema/connectionPoint";

export const connectionPointService = {
  create(clientId: string, data: TConnectionPointCreate) {
    return apiFetch(`/ponto-conexao/${clientId}`, {
      method: "POST",
      body: data,
    });
  },

  updatePlan(connectionPointId: string, data: TConnectionPointPlan) {
    return apiFetch(`/ponto-conexao/plano/${connectionPointId}`, {
      method: "PATCH",
      body: data,
    });
  },

  updateAddress(connectionPointId: string, data: TConnectionPointAddress) {
    return apiFetch(`/ponto-conexao/endereco/${connectionPointId}`, {
      method: "PATCH",
      body: data,
    });
  },

  updateAccess(
    connectionPointId: string,
    data: TConnectionPointUpdateMicrotik,
  ) {
    return apiFetch(`/ponto-conexao/acesso/${connectionPointId}`, {
      method: "PATCH",
      body: data,
    });
  },
};
