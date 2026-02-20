<template>
  <UModal title="Criando novo plano" :dismissible="false">
    <template #body="{ close }">
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
      >
        <UFormField label="Nome do Plano" name="nome" required>
          <UInput v-model="state.nome" class="w-full" />
        </UFormField>

        <div class="grid grid-cols-2 gap-6">
          <UFormField
            label="Vel. de Download"
            name="downloadMB"
            required
            help="em MB (megabyte)"
          >
            <UInputNumber v-model="state.downloadMB" :min="0" class="w-full" />
          </UFormField>

          <UFormField
            label="Vel. de Upload"
            name="uploadMB"
            required
            help="em MB (megabyte)"
          >
            <UInputNumber v-model="state.uploadMB" :min="0" class="w-full" />
          </UFormField>
        </div>

        <UFormField
          label="Valor"
          name="valor"
          required
          help="Defina 0 para planos gratuitos"
        >
          <UInputNumber
            v-model="state.valor"
            :min="0"
            :format-options="{
              style: 'currency',
              currency: 'BRL',
              currencyDisplay: 'symbol',
            }"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Descrição" name="descricao">
          <UInput v-model="state.descricao" class="w-full" />
        </UFormField>

        <div class="flex justify-end gap-3 pt-4">
          <UButton
            label="Cancelar"
            color="neutral"
            variant="ghost"
            @click="close"
          />
          <UButton type="submit" label="Criar" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { TPlan } from "~/types/plan";
const { fetchApi } = useApi();
const toast = useToast();

const schema = z.object({
  nome: z
    .string("Nome do plano é obrigatório")
    .min(5, "Precisa ter ao menos 10 caracteres"),
  uploadMB: z
    .number("Velocidade de Upload é obrigatório")
    .min(1, "Precisa ter ao menos 1 MB"),
  downloadMB: z
    .number("Velocidade de Download é obrigatório")
    .min(1, "Precisa ter ao menos 1 MB"),
  descricao: z.string().optional(),
  valor: z.number("Valor é obrigatório").min(0, "Precisa ser ao menos 0"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  nome: undefined,
  uploadMB: 0,
  downloadMB: 0,
  descricao: undefined,
  valor: 0,
});

const props = defineProps<{
  plan?: TPlan;
}>();

const onSubmit = (event: FormSubmitEvent<Schema>) => {
  if (props.plan) {
    submitPlan("PUT", event.data);
  } else {
    submitPlan("POST", event.data);
  }
};

const submitPlan = async (typeRequest: "POST" | "PUT", plan: TPlan) => {
  const { error } = await fetchApi(`/planos`, {
    method: typeRequest,
    body: plan,
  });

  if (error) {
    toast.add({
      description: `${error.status} - ${error.message}`,
      color: "error",
    });
    return;
  }

  const typeMessage = typeRequest === "POST" ? "criado" : "atualizado";

  toast.add({
    description: `Plano ${typeMessage} com sucesso`,
    color: "success",
  });
};

watch(
  () => props.plan,
  (newPlan) => {
    if (newPlan) {
      state.nome = newPlan.nome;
      state.uploadMB = newPlan.uploadMB;
      state.downloadMB = newPlan.downloadMB;
      state.descricao = newPlan.descricao;
      state.valor = newPlan.valor;
    }
  },
  { immediate: true },
);
</script>

<style scoped></style>
