<template>
  <UModal title="Criando novo plano" :dismissible="false">
    <template #body="{ close }">
      <UForm
        :schema="activeSchema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit(close)"
        :disabled="isLoading"
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
          <UButton type="submit" :label="btnLabel" :loading="isLoading" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { TPlan } from "~/types/plan";
import { planService } from "~/services/plan";
import {
  planCreateSchema,
  planUpdateSchema,
  type TPlanCreate,
  type TPlanUpdate,
} from "~/schema/plan.create";
const toast = useToast();

const emit = defineEmits(["refresh"]);

const activeSchema = computed(() =>
  props.plan ? planUpdateSchema : planCreateSchema,
);

const state = reactive<Partial<TPlanCreate>>({
  nome: "",
  uploadMB: 0,
  downloadMB: 0,
  descricao: "",
  valor: 0,
});

const props = defineProps<{
  plan?: TPlan;
}>();

const isLoading = ref<boolean>(false);

const isEditing = computed(() => props.plan);

const btnLabel = computed(() => (isEditing.value ? "Salvar" : "Criar"));

const onSubmit = async (close: () => void) => {
  try {
    isLoading.value = true;

    if (props.plan) {
      const updateData = state as TPlanUpdate;
      const body = getUpdateBody(updateData);

      if (body && Object.keys(body).length > 0) {
        await planService.update(props.plan.nome, body);
      } else {
        toast.add({
          description: "Nenhuma alteração detectada",
          color: "warning",
        });
        return;
      }
    } else {
      await planService.create(state as TPlanCreate);
    }

    toast.add({
      description: props.plan
        ? "Plano atualizado com sucesso"
        : "Plano criado com sucesso",
      color: "success",
    });

    emit("refresh");
    close();
  } catch (error) {
    toast.add({
      description: getErrorMessage(error),
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const getUpdateBody = (data: TPlanUpdate) => {
  const original = props.plan;

  if (!original) return {};

  const payload: Partial<TPlanUpdate> = {};

  if (data.nome !== original.nome) payload.nome = data.nome;
  if (data.uploadMB !== original.uploadMB) payload.uploadMB = data.uploadMB;
  if (data.downloadMB !== original.downloadMB)
    payload.downloadMB = data.downloadMB;
  if (data.valor !== original.valor) payload.valor = data.valor;
  if (data.descricao !== original.descricao) payload.descricao = data.descricao;

  if (Object.keys(payload).length === 0) return;

  return payload;
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
