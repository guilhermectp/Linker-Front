import type { TPlanCreate, TPlanUpdate } from "~/schema/plan.create";

export const planService = {
  async create(newPlan: TPlanCreate) {
    return apiFetch("/planos", {
      method: "POST",
      body: newPlan,
    });
  },

  async update(namePlan: string, updatedPlan: TPlanUpdate) {
    return apiFetch(`/planos/${namePlan}`, {
      method: "PATCH",
      body: updatedPlan,
    });
  },

  async delete(namePlan: string) {
    return apiFetch(`/planos/${namePlan}`, {
      method: "DELETE",
    });
  },
};
