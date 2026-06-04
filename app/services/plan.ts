import type { TPlanCreate, TPlanUpdate } from "~/schema/plan.create";

export const planService = {
  async create(newPlan: TPlanCreate) {
    return useApi("/planos", {
      method: "POST",
      body: newPlan,
    });
  },

  async update(namePlan: string, updatedPlan: TPlanUpdate) {
    return useApi(`/planos/${namePlan}`, {
      method: "PATCH",
      body: updatedPlan,
    });
  },

  async delete(namePlan: string) {
    return useApi(`/planos/${namePlan}`, {
      method: "DELETE",
    });
  },
};
