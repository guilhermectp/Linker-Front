<template>
  <UModal title="Editando Endereço" :dismissible="false">
    <template #body="{ close }">
      <UForm
        :schema="addressSchema"
        :state="state"
        class="space-y-6 max-w-2xl mx-auto"
        @submit.prevent="onSubmit"
        ref="form"
      >
        <ClientCreateFormAddress :model-value="state" :is-editing="true" />

        <div class="flex justify-between pt-6">
          <UButton
            color="neutral"
            variant="ghost"
            label="Cancelar"
            @click="close"
          />
          <UButton type="submit" label="Salvar" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { TFormEndereco } from "~/types/connectionPoint";

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

const addressSchema = z.discriminatedUnion("tipoEndereco", [
  urbanAddressSchema,
  ruralAddressSchema,
]);

type TSchema = z.infer<typeof addressSchema>;

const props = defineProps({
  clientToEdit: {
    type: Object as PropType<TFormEndereco>,
    required: true,
  },
});

const initialFormState = (): TSchema => {
  const initial = props.clientToEdit;
  if (initial.tipoEndereco === "URBANO") {
    return {
      tipoEndereco: "URBANO",
      cep: initial.cep ?? "",
      cidade: initial.cidade ?? "",
      bairro: initial.bairro ?? "",
      rua: initial.rua ?? "",
      numero: initial.numero ?? 0,
      complemento: initial.complemento ?? "",
      latitude: initial.latitude ?? "",
      longitude: initial.longitude ?? "",
    };
  }

  return {
    tipoEndereco: "RURAL",
    nomeLocal: initial.nomeLocal ?? "",
    cidadeReferencia: initial.cidadeReferencia ?? "",
    complemento: initial.complemento ?? "",
    latitude: initial.latitude ?? "",
    longitude: initial.longitude ?? "",
  };
};

const state = reactive<TSchema>(initialFormState());

const form = ref();

const onSubmit = async () => {
  form.value.schema = addressSchema;

  const valid = await form.value?.validate();
  if (!valid) return;

  console.log(state);
};
</script>

<style scoped></style>
