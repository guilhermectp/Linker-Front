<template>
  <div class="bg-muted border border-accented rounded-lg p-4 space-y-6">
    <UFormField label="Plano" name="planoId" required>
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

    <UFormField label="Dia de Vencimento" name="diaVencimento" required>
      <USelect
        v-model="model.diaVencimento"
        :items="[5, 10, 15, 20, 25]"
        class="w-full"
      />
    </UFormField>
  </div>
</template>

<script setup lang="ts">
import type { TConnectionPointPlan } from "~/schema/connectionPoint";
import type { TPlan } from "~/types/plan";

const props = defineProps({
  modelValue: {
    type: Object as PropType<TConnectionPointPlan>,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const { data, status } = await useAsyncApi<TPlan[]>(
  "plans-fetch-all-select",
  "/planos",
  {
    lazy: true,
  },
);

const isLoadingPlans = computed(() => status.value === "pending");
</script>

<style scoped></style>
