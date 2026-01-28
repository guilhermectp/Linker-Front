<template>
  <div>
    <UForm
      :schema="schema"
      :state="state"
      class="space-y-6 max-w-2xl mx-auto"
      @submit.prevent="onSubmit"
    >
      <UStepper ref="stepper" :items="items" linear :disabled="true">
        <template #info>
          <ClientCreateFormInfo :model-value="state" />
        </template>

        <template #plan>
          <ClientCreateFormPlan :model-value="state" />
        </template>

        <template #address>
          <ClientCreateFormAddress :model-value="state" />
        </template>
      </UStepper>

      <div class="flex gap-2 justify-between mt-4">
        <UButton
          leading-icon="i-lucide-arrow-left"
          :disabled="!stepper?.hasPrev"
          @click="stepper?.prev()"
        >
          Prev
        </UButton>

        <UButton
          trailing-icon="i-lucide-arrow-right"
          :disabled="!stepper?.hasNext"
          @click="stepper?.next()"
        >
          Next
        </UButton>
      </div>

      <div class="flex justify-end gap-3 pt-4">
        <UButton label="Cancelar" color="neutral" variant="ghost" @click="" />
        <UButton type="submit" label="Cadastrar" />
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, StepperItem } from "@nuxt/ui";
import type { TPostCliente } from "~/types/clients";
const { fetch } = useApi();
const toast = useToast();

const enderecoUrbanoSchema = z.object({
  tipoEndereco: z.literal("URBANO"),
  cep: z.string().min(8),
  cidade: z.string().min(2),
  bairro: z.string().min(2),
  rua: z.string().min(2),
  numero: z.number().int().positive(),
  complemento: z.string().optional(),
  latitude: z.string(),
  longitude: z.string(),
});

const enderecoRuralSchema = z.object({
  tipoEndereco: z.literal("RURAL"),
  nomeLocal: z.string(),
  cidadeReferencia: z.string().optional(),
  complemento: z.string(),
  latitude: z.string(),
  longitude: z.string(),
});

const pontoSchema = z.object({
  planoId: z.uuid(),
  diaVencimento: z.number().int().min(1).max(31),
  loginMK: z.string().min(3),
  senhaMK: z.string().min(6),
  endereco: z.discriminatedUnion("tipoEndereco", [
    enderecoUrbanoSchema,
    enderecoRuralSchema,
  ]),
});

const schema = z.object({
  nome: z.string().min(5),
  cpf: z.string().min(11),
  email: z.email(),
  telefone: z.string().min(10),
  senhaCentralCliente: z.string().min(8),
  ponto: pontoSchema,
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
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
    },
  },
});

const stepper = useTemplateRef("stepper");

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

const normalizeCoordinate = (value?: string) => {
  if (!value) return undefined;
  return value.replace(",", ".");
};

const onSubmit = (event: FormSubmitEvent<Schema>) => {
  console.log(state);
  console.log(event.data);
};
</script>

<style scoped></style>
