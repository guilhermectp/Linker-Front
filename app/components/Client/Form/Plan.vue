<template>
  <div class="bg-muted border border-accented rounded-lg p-4 space-y-6">
    <UFormField label="Plano" name="ponto.planoId" required>
      <USelect
        v-model="model.planoId"
        :items="data"
        label-key="nome"
        value-key="id"
        class="w-full"
        :disabled="isLoadingPlans"
        :loading="isLoadingPlans"
      />
    </UFormField>

    <UFormField label="Dia de Vencimento" name="ponto.diaVencimento" required>
      <USelect
        v-model="model.diaVencimento"
        :items="[5, 10, 15, 20, 25]"
        class="w-full"
      />
    </UFormField>

    <UFormField label="Usuario do Microtik" name="ponto.loginMK" required>
      <UInput v-model="model.loginMK" class="w-full" />
    </UFormField>

    <UFormField label="Senha do Microtik" name="ponto.senhaMK" required>
      <UInput v-model="model.senhaMK" class="w-full" />
    </UFormField>
  </div>
</template>

<script setup lang="ts">
import type { TFormPontoConexao } from "~/types/connectionPoint";
import type { TPlan } from "~/types/plan";
const { asyncFetch } = useApi();

const props = defineProps({
  modelValue: { type: Object as PropType<TFormPontoConexao>, required: true },
  isEditing: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const { data, status, error, refresh } = await asyncFetch<TPlan[]>(
  "plans-fetch-all-select",
  "/planos",
  {
    lazy: true,
  },
);

const isLoadingPlans = computed(() => status.value === "pending");
</script>

<style scoped></style>
