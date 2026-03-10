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

const emit = defineEmits(["updated"]);

const props = defineProps({
  clientToEdit: {
    type: Object as PropType<TClientUpdateInfo>,
    required: true,
  },
});

const state = reactive<TClientUpdateInfo>({
  cpf: props.clientToEdit.cpf || "",
  nome: props.clientToEdit.nome || "",
  email: props.clientToEdit.email || "",
  telefone: props.clientToEdit.telefone || "",
});

const form = ref();

const onSubmit = async (close: () => void) => {
  try {
    await form.value?.validate();
  } catch (error) {
    return;
  }

  console.log(state);
  emit("updated");
  close();
};
</script>

<style scoped></style>
