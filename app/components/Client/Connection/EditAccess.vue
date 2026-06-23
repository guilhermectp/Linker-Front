<template>
  <UModal title="Novo Ponto">
    <template #body="{ close }">
      <UForm
        :state="state"
        :schema="connectionPointUpdateMicrotikSchema"
        class="space-y-6 max-w-2xl mx-auto"
        @submit.prevent="onSubmit(close)"
        ref="form"
        :disabled="isLoading"
      >
        <ClientFormMicrotik v-model="state" />

        <div class="flex justify-between pt-6">
          <UButton
            color="neutral"
            variant="ghost"
            label="Cancelar"
            @click="close"
          />
          <UButton type="submit" label="Alterar" :loading="isLoading" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import {
  connectionPointUpdateMicrotikSchema,
  type TConnectionPointUpdateMicrotik,
} from "~/schema/connectionPoint";
import { connectionPointService } from "~/services/connectionPoint";
const toast = useToast();

const emit = defineEmits(["refresh"]);

const props = defineProps({
  connectionPointId: { type: String, required: true },
  currentLogin: {
    type: String,
    required: true,
  },
});

const state = reactive<TConnectionPointUpdateMicrotik>({
  loginMK: props.currentLogin,
  senhaMK: "",
});

const isLoading = ref<boolean>(false);

const onSubmit = async (close: () => void) => {
  const loginChanged = state.loginMK !== props.currentLogin;
  const passwordChanged = !!state.senhaMK;

  if (!loginChanged && !passwordChanged) return;

  const body: TConnectionPointUpdateMicrotik = {
    ...(loginChanged && { loginMK: state.loginMK }),
    ...(passwordChanged && { senhaMK: state.senhaMK }),
  };

  try {
    isLoading.value = true;

    await connectionPointService.updateAccess(props.connectionPointId, body);

    toast.add({
      description: "Acesso microtik alterado.",
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
</script>
