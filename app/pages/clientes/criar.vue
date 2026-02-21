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
import * as z from "zod";
import type { StepperItem } from "@nuxt/ui";
const toast = useToast();

const urbanAddressSchema = z.object({
  tipoEndereco: z.literal("URBANO"),
  cep: z.string().length(10, "CEP deve conter 8 dígitos"),
  cidade: z.string().min(2, "Cidade é obrigatória"),
  bairro: z.string().min(2, "Bairro é obrigatório"),
  rua: z.string().min(2, "Rua é obrigatório"),
  numero: z.number().int().positive("Número inválido"),
  complemento: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

const ruralAddressSchema = z.object({
  tipoEndereco: z.literal("RURAL"),
  nomeLocal: z.string().min(2, "Nome do local é obrigatório"),
  cidadeReferencia: z
    .string()
    .min(2, "Referência de proximidade é obrigatório"),
  complemento: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

const addressSchema = z.object({
  ponto: z.object({
    endereco: z.discriminatedUnion("tipoEndereco", [
      urbanAddressSchema,
      ruralAddressSchema,
    ]),
  }),
});

const planSchema = z.object({
  ponto: z.object({
    planoId: z.uuid("Plano inválido"),
    diaVencimento: z
      .number()
      .int()
      .min(1, "Dia mínimo é 1")
      .max(31, "Dia máximo é 31"),
    loginMK: z.string().min(8, "O login deve ter pelo menos 8 caracteres"),
    senhaMK: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
  }),
});

const infoSchema = z.object({
  nome: z.string().trim().min(2, "Nome é obrigatório"),
  cpf: z.string().length(14, "O CPF deve ter 11 dígitos"),
  email: z.email("E-mail inválido"),
  telefone: z.string().length(15, "O telefone deve conter 10 dígitos"),
  senhaCentralCliente: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres"),
});

const fullSchema = z.object({
  ...infoSchema.shape,
  ponto: z.object({
    ...planSchema.shape.ponto.shape,
    ...addressSchema.shape.ponto.shape,
  }),
});

type FullSchema = z.infer<typeof fullSchema>;

const state = reactive<FullSchema>({
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
const stepSchemas = [infoSchema, planSchema, addressSchema];

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
  const valid = await form.value?.validate();

  if (!valid) return;

  if (!isLastStep.value) {
    currentStepIndex.value++;
  }
};

const normalizeCoordinate = (value?: string) => {
  if (!value) return undefined;
  return value.replace(",", ".");
};

const onSubmit = async () => {
  form.value.schema = fullSchema;

  const valid = await form.value?.validate();
  if (!valid) return;

  console.log(state);
};
</script>

<style scoped></style>
