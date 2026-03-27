import type { TClientCreate } from "~/schema/client.create";
import type {
  TClientUpdateConnectionPoint,
  TClientUpdateInfo,
} from "~/schema/client.update";

export const clientService = {
  async getById(clientId: string) {
    return apiFetch(`/clientes/${clientId}`, {
      method: "GET",
    });
  },

  async create(newClient: TClientCreate) {
    return apiFetch("/clientes", {
      method: "POST",
      body: newClient,
    });
  },

  async updateInfo(
    clientId: string,
    updatedClient: Partial<TClientUpdateInfo>,
  ) {
    return apiFetch(`/clientes/atualizar/${clientId}`, {
      method: "PUT",
      body: updatedClient,
    });
  },

  async updateConnectionPoint(
    clientId: string,
    pointId: string,
    updatedPoint: TClientUpdateConnectionPoint,
  ) {
    return apiFetch(`/clientes/atualizar-ponto/${clientId}/${pointId}`, {
      method: "PUT",
      body: updatedPoint,
    });
  },
};
