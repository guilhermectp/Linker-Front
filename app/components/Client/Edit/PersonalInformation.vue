<template>
  <UModal title="Editando Cliente" :dismissible="false">
    <UButton icon="i-heroicons-pencil" color="neutral">
      Editar Cliente
    </UButton>

    <template #body="{ close }">
      <UForm
        :schema="infoSchema"
        :state="state"
        class="space-y-6 max-w-2xl mx-auto"
        @submit.prevent="onSubmit"
        ref="form"
      >
        <ClientCreateFormInfo :model-value="state" :is-editing="true" />

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
import type { TFormCliente } from "~/types/clients";

const infoSchema = z.object({
  nome: z.string().trim().min(2, "Nome é obrigatório"),
  cpf: z.string().length(14, "O CPF deve ter 11 dígitos"),
  email: z.email("E-mail inválido"),
  telefone: z.string().length(15, "O telefone deve conter 10 dígitos"),
  senhaCentralCliente: z
    .string()
    .optional()
    .or(z.literal(undefined))
    .refine(
      (val) => !val || val.length >= 8,
      "A senha deve ter pelo menos 8 caracteres",
    ),
});

type TSchema = z.infer<typeof infoSchema>;

const props = defineProps({
  clientToEdit: {
    type: Object as PropType<TFormCliente>,
    required: true,
  },
});

const state = reactive<TSchema>({
  cpf: props.clientToEdit.cpf || "",
  nome: props.clientToEdit.nome || "",
  email: props.clientToEdit.email || "",
  telefone: props.clientToEdit.telefone || "",
  senhaCentralCliente: undefined,
});

const form = ref();

const onSubmit = async () => {
  form.value.schema = infoSchema;

  const valid = await form.value?.validate();
  if (!valid) return;

  console.log(state);
};
</script>

<style scoped></style>
