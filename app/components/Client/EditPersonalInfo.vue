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
} from "~/schema/client";
import { clientService } from "~/services/client";
const { successToast, errorToast } = useAppToast();

const emit = defineEmits(["refresh"]);

const props = defineProps({
  clientId: { type: String, required: true },
  clientToEdit: {
    type: Object as PropType<TClientUpdateInfo>,
    required: true,
  },
});

const state = reactive<TClientUpdateInfo>({
  nome: props.clientToEdit.nome,
  email: props.clientToEdit.email,
  telefone: props.clientToEdit.telefone,
});

const isLoading = ref<boolean>(false);

const onSubmit = async (close: () => void) => {
  try {
    isLoading.value = true;

    const original = props.clientToEdit;
    const payload: Partial<TClientUpdateInfo> = {};

    if (state.nome !== original.nome) payload.nome = state.nome;
    if (state.email !== original.email) payload.email = state.email;
    if (state.telefone !== original.telefone) payload.telefone = state.telefone;

    await clientService.updateInfo(props.clientId, payload);
    successToast("Informações alteradas.");
    emit("refresh");
    close();
  } catch (error) {
    errorToast(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped></style>
