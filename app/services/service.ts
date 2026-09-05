import type { PostOrdemServico } from "~/types/serviceOrder";

export const serviceService = {
  create(newSupport: PostOrdemServico) {
    return useApi("/suporte", {
      method: "POST",
      body: newSupport,
    });
  },

  //  update(id: string, updatedSupport: ServiceUpdateBody) {
  //   return useApi(`/suporte/${id}`, {
  //     method: "PATCH",
  //     body: updatedSupport,
  //   });
  // },
};
