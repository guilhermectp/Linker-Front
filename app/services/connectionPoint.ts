import type { TUpdateConnectionPoint } from "~/schema/connectionPoint";

export const connectionPointService = {
  async create(clientId: string, data: TUpdateConnectionPoint) {
    return apiFetch(`/ponto-conexao/${clientId}`, {
      method: "POST",
      body: data,
    });
  },

  async update(connectionPointId: string, data: TUpdateConnectionPoint) {
    return apiFetch(`/ponto-conexao/${connectionPointId}`, {
      method: "PATCH",
      body: data,
    });
  },
};
