<template>
  <UModal title="Novo Ponto">
    <template #body="{ close }">
      <UForm
        :state="state"
        :schema="connectionPointPlanSchema"
        class="space-y-6 max-w-2xl mx-auto"
        @submit.prevent="onSubmit(close)"
        ref="form"
        :disabled="isLoading"
      >
        <ClientFormPlan v-model="state" />

        <div class="flex justify-between pt-6">
          <UButton
            color="neutral"
            variant="ghost"
            label="Cancelar"
            @click="close"
          >
          </UButton>
          <UButton type="submit" label="Alterar" :loading="isLoading" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import {
  connectionPointPlanSchema,
  type TConnectionPointPlan,
} from "~/schema/connectionPoint";
import { connectionPointService } from "~/services/connectionPoint";
const toast = useToast();

const emit = defineEmits(["refresh"]);

const props = defineProps({
  connectionPointId: { type: String, required: true },
  currentPlan: {
    type: Object as PropType<TConnectionPointPlan>,
    required: true,
  },
});

const state = reactive<TConnectionPointPlan>({
  planoId: props.currentPlan.planoId,
  diaVencimento: props.currentPlan.diaVencimento,
});

const isLoading = ref<boolean>(false);

const onSubmit = async (close: () => void) => {
  const planoChanged = state.planoId !== props.currentPlan.planoId;
  const datePaymentChanged =
    state.diaVencimento !== props.currentPlan.diaVencimento;

  if (!planoChanged && !datePaymentChanged) return;

  try {
    isLoading.value = true;

    await connectionPointService.updatePlan(props.connectionPointId, state);

    toast.add({
      description: "Plano alterado.",
      color: "success",
    });

    emit("refresh");
    close();
  } catch (error) {
    toast.add({
      description: getErrorMessage(error),
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped></style>
