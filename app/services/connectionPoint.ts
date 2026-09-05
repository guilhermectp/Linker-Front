import type {
  TConnectionPointAddress,
  TConnectionPointCreate,
  TConnectionPointPlan,
  TConnectionPointUpdateMicrotik,
} from "~/schema/connectionPoint";

export const connectionPointService = {
  create(clientId: string, data: TConnectionPointCreate) {
    return useApi(`/ponto-conexao/${clientId}`, {
      method: "POST",
      body: data,
    });
  },

  updatePlan(connectionPointId: string, data: TConnectionPointPlan) {
    return useApi(`/ponto-conexao/plano/${connectionPointId}`, {
      method: "PATCH",
      body: data,
    });
  },

  updateAddress(connectionPointId: string, data: TConnectionPointAddress) {
    return useApi(`/ponto-conexao/endereco/${connectionPointId}`, {
      method: "PATCH",
      body: data,
    });
  },

  updateAccess(
    connectionPointId: string,
    data: TConnectionPointUpdateMicrotik,
  ) {
    return useApi(`/ponto-conexao/microtik/${connectionPointId}`, {
      method: "PATCH",
      body: data,
    });
  },

  delete(connectionPointId: string) {
    return useApi(`ponto-conexao/${connectionPointId}`, {
      method: "DELETE",
    });
  },

  getByClientId(clientId: string) {
    return useApi(`ponto-conexao/${clientId}`, {
      method: "GET",
    });
  },
};
