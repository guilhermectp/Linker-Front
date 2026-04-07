import type { TClientCreate } from "~/schema/client";
import type {
  // TClientUpdateConnectionPoint,
  TClientUpdateInfo,
  TClientUpdatePassword,
} from "~/schema/client";

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
      method: "PATCH",
      body: updatedClient,
    });
  },

  async updateCustomerCentralPassword(
    clientId: string,
    newPassword: TClientUpdatePassword,
  ) {
    return apiFetch(`/clientes/atualizar-senha/${clientId}`, {
      method: "PUT",
      body: newPassword,
    });
  },

  // async updateConnectionPoint(
  //   clientId: string,
  //   pointId: string,
  //   updatedPoint: TClientUpdateConnectionPoint,
  // ) {
  //   return apiFetch(`/clientes/atualizar-ponto/${clientId}/${pointId}`, {
  //     method: "PUT",
  //     body: updatedPoint,
  //   });
  // },
};
