import type { PatchOrdemServico, PostOrdemServico } from "~/types/serviceOrder";

export const serviceService = {
  create(newSupport: PostOrdemServico) {
    return useApi("/suporte", {
      method: "POST",
      body: newSupport,
    });
  },

  update(id: string, updatedSupport: PatchOrdemServico) {
    return useApi(`/suporte/${id}`, {
      method: "PATCH",
      body: updatedSupport,
    });
  },

  delete(id: string) {
    return useApi(`/suporte/${id}`, {
      method: "DELETE",
    });
  },
};
