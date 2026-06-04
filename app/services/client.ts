import type { TClientCreate } from "~/schema/client";
import type {
  // TClientUpdateConnectionPoint,
  TClientUpdateInfo,
  TClientUpdatePassword,
} from "~/schema/client";

export const clientService = {
  async getById(clientId: string) {
    return useApi(`/clientes/${clientId}`, {
      method: "GET",
    });
  },

  async create(newClient: TClientCreate) {
    return useApi("/clientes", {
      method: "POST",
      body: newClient,
    });
  },

  async updateInfo(
    clientId: string,
    updatedClient: Partial<TClientUpdateInfo>,
  ) {
    return useApi(`/clientes/atualizar/${clientId}`, {
      method: "PATCH",
      body: updatedClient,
    });
  },

  async updateCustomerCentralPassword(
    clientId: string,
    newPassword: TClientUpdatePassword,
  ) {
    return useApi(`/clientes/atualizar-senha/${clientId}`, {
      method: "PUT",
      body: newPassword,
    });
  },

  // async updateConnectionPoint(
  //   clientId: string,
  //   pointId: string,
  //   updatedPoint: TClientUpdateConnectionPoint,
  // ) {
  //   return useApi(`/clientes/atualizar-ponto/${clientId}/${pointId}`, {
  //     method: "PUT",
  //     body: updatedPoint,
  //   });
  // },
};
