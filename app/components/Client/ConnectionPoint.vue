<template>
  <UModal :title="title" class="max-w-2xl">
    <template #body="{ close }">
      <UForm
        :schema="stepSchemas[currentStepIndex]"
        :state="state"
        class="space-y-6 mx-auto"
        @submit.prevent="onSubmit"
        ref="form"
      >
        <UStepper
          v-model="currentStepIndex"
          :items="items"
          linear
          :disabled="true"
        >
          <template #plan>
            <ClientFormPlan v-model="state.ponto" />
          </template>

          <template #address>
            <ClientFormAddress v-model="state.ponto.endereco" />
          </template>
        </UStepper>

        <div class="flex justify-between pt-6">
          <UButton color="neutral" variant="ghost" @click="handleBack(close)">
            {{ isFirstStep ? "Cancelar" : "Voltar" }}
          </UButton>
          <UButton v-if="!isLastStep" label="Avançar" @click="handleNext" />
          <UButton v-else type="submit" :label="submitLabel" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { StepperItem } from "@nuxt/ui";
import {
  clientCreateAddressSchema,
  clientCreatePlanSchema,
} from "~/schema/client.create";
import type { TClientUpdateConnectionPoint } from "~/schema/client.update";

const props = defineProps({
  pointToEdit: {
    type: Object as PropType<TClientUpdateConnectionPoint>,
  },
});

const state = reactive<TClientUpdateConnectionPoint>({
  ponto: {
    planoId: "",
    diaVencimento: 1,
    loginMK: "",
    senhaMK: "",
    endereco: {
      tipoEndereco: "URBANO",
      cep: "",
      cidade: "",
      bairro: "",
      rua: "",
      numero: 0,
      complemento: "",
      latitude: undefined,
      longitude: undefined,
    },
  },
});

const items = [
  {
    slot: "plan" as const,
    title: "Plano e Acesso",
    icon: "lucide:wifi",
  },
  {
    slot: "address" as const,
    title: "Endereço",
    icon: "lucide:map-pin",
  },
] satisfies StepperItem[];

const form = ref();
const currentStepIndex = ref(0);
const stepSchemas = [clientCreatePlanSchema, clientCreateAddressSchema];

const isToEdit = computed(() => props.pointToEdit);
const title = computed(() =>
  isToEdit.value ? "Editando Ponto" : "Adicionando Ponto",
);
const submitLabel = computed(() => (isToEdit.value ? "Salvar" : "Adicionar"));
const isFirstStep = computed(() => currentStepIndex.value === 0);
const isLastStep = computed(() => currentStepIndex.value === items.length - 1);

const handleBack = (close: () => void) => {
  if (isFirstStep.value) {
    close();
    return;
  }

  currentStepIndex.value--;
};

const handleNext = async () => {
  try {
    await form.value?.validate();
  } catch (error) {
    return;
  }

  if (!isLastStep.value) {
    currentStepIndex.value++;
  }
};

const onSubmit = async () => {
  try {
    await form.value?.validate();
  } catch (error) {
    return;
  }

  console.log(state);
};

watchEffect(() => {
  if (props.pointToEdit) {
    Object.assign(state, props.pointToEdit);
  }
});
</script>

<style scoped></style>
