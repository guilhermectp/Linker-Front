<template>
  <UModal title="Editando Cliente">
    <template #body="{ close }">
      <UForm
        :schema="clientUpdateInfoSchema"
        :state="state"
        class="space-y-6 max-w-2xl mx-auto"
        @submit.prevent="onSubmit(close)"
        ref="form"
      >
        <ClientFormInfo v-model="state" :is-edit-mode="true" />

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
import {
  clientUpdateInfoSchema,
  type TClientUpdateInfo,
} from "~/schema/client.update";
import { clientService } from "~/services/client";
const toast = useToast();

const emit = defineEmits(["refresh"]);

const props = defineProps({
  clientId: { type: String, required: true },
  clientToEdit: {
    type: Object as PropType<TClientUpdateInfo>,
    required: true,
  },
});

const state = reactive<TClientUpdateInfo>({
  cpf: props.clientToEdit.cpf,
  nome: props.clientToEdit.nome,
  email: props.clientToEdit.email,
  telefone: props.clientToEdit.telefone,
});

const form = ref();

const isLoading = ref<boolean>(false);

const onSubmit = async (close: () => void) => {
  try {
    await form.value?.validate();
  } catch (error) {
    return;
  }

  try {
    isLoading.value = true;

    const original = props.clientToEdit;
    const payload: Partial<TClientUpdateInfo> = {};

    if (state.nome !== original.nome) payload.nome = state.nome;
    if (state.email !== original.email) payload.email = state.email;
    if (state.telefone !== original.telefone) payload.nome = state.telefone;

    await clientService.updateInfo(props.clientId, payload);
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
</script>

<style scoped></style>
