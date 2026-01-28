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

        <UButton label="Deletar Plano" color="error" @click="deletePlan()" />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { TPlan } from "~/types/plan";

const props = defineProps<{
  plan: TPlan;
}>();

const deletePlan = () => {
  // Lógica para deletar o plano
};
</script>

<style scoped></style>
