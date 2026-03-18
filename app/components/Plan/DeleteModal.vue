<template>
  <UModal title="Criando novo plano" :dismissible="false">
    <template #body="{ close }">
      <p>
        Tem certeza que deseja deletar o plano
        <span class="font-medium">"{{ plan.nome }}"</span>
        ?
      </p>

      <div class="flex justify-end gap-3 pt-4">
        <UButton
          label="Cancelar"
          color="neutral"
          variant="ghost"
          @click="close"
        />

        <UButton
          label="Deletar Plano"
          color="error"
          @click="deletePlan(close)"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { planService } from "~/services/plan";
import type { TPlan } from "~/types/plan";
const toast = useToast();

const emit = defineEmits(["refresh"]);

const props = defineProps<{
  plan: TPlan;
}>();

const isLoading = ref<boolean>(false);

const deletePlan = async (close: () => void) => {
  try {
    isLoading.value = true;

    await planService.delete(props.plan.nome);

    toast.add({
      description: "Plano deletado com sucesso",
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
