<template>
  <div>
    <UForm
      :schema="stepSchemas[currentStepIndex]"
      :state="state"
      class="space-y-6 max-w-2xl mx-auto"
      @submit.prevent="onSubmit"
      ref="form"
    >
      <UStepper
        v-model="currentStepIndex"
        :items="items"
        linear
        :disabled="true"
      >
        <template #info>
          <ClientFormInfo v-model="state" />
        </template>

        <template #plan>
          <ClientFormPlan v-model="state.ponto" />
        </template>

        <template #address>
          <ClientFormAddress v-model="state.ponto.endereco" />
        </template>
      </UStepper>

      <div class="flex justify-between pt-6">
        <UButton color="neutral" variant="ghost" @click="handleBack">
          {{ isFirstStep ? "Cancelar" : "Voltar" }}
        </UButton>
        <UButton v-if="!isLastStep" label="Avançar" @click="handleNext" />
        <UButton v-else type="submit" label="Cadastrar" />
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { StepperItem } from "@nuxt/ui";
import {
  clientCreateInfoSchema,
  clientCreatePlanSchema,
  clientCreateAddressSchema,
  type TClientCreate,
} from "~/schema/client.create";
const toast = useToast();

const state = reactive<TClientCreate>({
  nome: "",
  cpf: "",
  email: "",
  telefone: "",
  senhaCentralCliente: "",
  ponto: {
    planoId: "",
    diaVencimento: 10,
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
      latitude: "",
      longitude: "",
      // cidadeReferencia: "",
      // nomeLocal: "",
    },
  },
});

const items = [
  {
    slot: "info" as const,
    title: "Informações do Cliente",
    icon: "lucide:user",
  },
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
const stepSchemas = [
  clientCreateInfoSchema,
  clientCreatePlanSchema,
  clientCreateAddressSchema,
];

const isFirstStep = computed(() => currentStepIndex.value === 0);
const isLastStep = computed(() => currentStepIndex.value === items.length - 1);

const handleBack = () => {
  if (isFirstStep.value) {
    navigateTo("/clientes");
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
</script>

<style scoped></style>
