<template>
  <div>
    <UForm
      :state="stepStates[currentStepIndex]"
      :schema="stepSchemas[currentStepIndex]"
      class="space-y-6 max-w-2xl mx-auto"
      @submit.prevent="onSubmit"
      ref="form"
      :disabled="isLoading"
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
          <ClientFormPlan v-model="state.plano" />
        </template>

        <template #address>
          <ClientFormAddress v-model="state.endereco" />
        </template>

        <template #access>
          <ClientFormMicrotik v-model="state.microtik" />
        </template>
      </UStepper>

      <div class="flex justify-between pt-6">
        <UButton color="neutral" variant="ghost" @click="handleBack">
          {{ isFirstStep ? "Cancelar" : "Voltar" }}
        </UButton>
        <UButton v-if="!isLastStep" label="Avançar" @click="handleNext" />
        <UButton v-else type="submit" label="Cadastrar" :loading="isLoading" />
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { StepperItem } from "@nuxt/ui";
import { clientCreateInfoSchema, type TClientCreate } from "~/schema/client";
import {
  connectionPointAddressSchema,
  connectionPointMicrotikSchema,
  connectionPointPlanSchema,
} from "~/schema/connectionPoint";
import { clientService } from "~/services/client";
const toast = useToast();

const items = [
  {
    slot: "info" as const,
    title: "Informações do Cliente",
    icon: "lucide:user",
  },
  {
    slot: "plan" as const,
    title: "Plano",
    icon: "lucide:wifi",
  },
  {
    slot: "address" as const,
    title: "Endereço",
    icon: "lucide:map-pin",
  },
  {
    slot: "access" as const,
    title: "Acesso",
    icon: "lucide:lock-keyhole",
  },
] satisfies StepperItem[];

const stepSchemas = [
  clientCreateInfoSchema,
  connectionPointPlanSchema,
  connectionPointAddressSchema,
  connectionPointMicrotikSchema,
];

const stepStates = computed(() => [
  state,
  state.plano,
  state.endereco,
  state.microtik,
]);

const state = reactive<TClientCreate>({
  nome: "",
  cpf: "",
  email: "",
  telefone: "",
  senhaCentralCliente: "",
  plano: {
    planoId: "",
    diaVencimento: 10,
  },
  microtik: {
    senhaMK: "",
    loginMK: "",
  },
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
});

const form = ref();
const isLoading = ref<boolean>(false);
const currentStepIndex = ref<number>(0);

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

  try {
    isLoading.value = true;

    await clientService.create(state);

    toast.add({
      description: "Cliente cadastrado com sucesso.",
      color: "success",
    });

    navigateTo(`/clientes`);
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
