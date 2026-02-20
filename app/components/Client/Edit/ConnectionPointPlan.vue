<template>
  <UModal title="Editando Plano" :dismissible="false">
    <template #body="{ close }">
      <UForm
        :schema="planSchema"
        :state="state"
        class="space-y-6 max-w-2xl mx-auto"
        @submit.prevent="onSubmit"
        ref="form"
      >
        <ClientCreateFormPlan :model-value="state" :is-editing="true" />

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
import type { TFormPontoConexao } from "~/types/connectionPoint";

const planSchema = z.object({
  planoId: z.uuid("Plano inválido"),
  diaVencimento: z
    .number()
    .int()
    .min(1, "Dia mínimo é 1")
    .max(31, "Dia máximo é 31"),
  loginMK: z.string().min(8, "O login deve ter pelo menos 8 caracteres"),
  senhaMK: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

type TSchema = z.infer<typeof planSchema>;

const props = defineProps({
  clientToEdit: {
    type: Object as PropType<TFormPontoConexao>,
    required: true,
  },
});

const state = reactive<TSchema>({
  planoId: props.clientToEdit.planoId,
  diaVencimento: props.clientToEdit.diaVencimento || 10,
  loginMK: props.clientToEdit.loginMK,
  senhaMK: "",
});

const form = ref();

const onSubmit = async () => {
  form.value.schema = planSchema;

  const valid = await form.value?.validate();
  if (!valid) return;

  console.log(state);
};
</script>

<style scoped></style>
