<template>
  <UModal title="Alterar senha da central do cliente">
    <template #body="{ close }">
      <UForm
        :schema="clientUpdatePasswordSchema"
        :state="state"
        class="space-y-6 mx-auto"
        @submit.prevent="onSubmit(close)"
        :disabled="isLoading"
      >
        <UFormField label="Senha" name="senhaCentralCliente" required>
          <UInput
            v-model="state.senhaCentralCliente"
            placeholder="Nova senha"
            :type="show ? 'text' : 'password'"
            :ui="{ trailing: 'pe-1' }"
            class="w-full"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="show ? 'Ocultar senha' : 'Mostrar senha'"
                :aria-pressed="show"
                aria-controls="password"
                @click="show = !show"
              />
            </template>
          </UInput>
        </UFormField>

        <div class="flex justify-between pt-6">
          <UButton
            color="neutral"
            variant="ghost"
            label="Cancelar"
            @click="close"
            :disabled="isLoading"
          />
          <UButton type="submit" label="Salvar" :loading="isLoading" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import {
  clientUpdatePasswordSchema,
  type TClientUpdatePassword,
} from "~/schema/client";
import { clientService } from "~/services/client";
const { successToast, errorToast } = useAppToast();

const props = defineProps({
  clientId: { type: String, required: true },
});

const show = ref(false);

const state = reactive<TClientUpdatePassword>({
  senhaCentralCliente: "",
});

const isLoading = ref<boolean>(false);

const onSubmit = async (close: () => void) => {
  try {
    isLoading.value = true;

    const payload: TClientUpdatePassword = {
      senhaCentralCliente: state.senhaCentralCliente,
    };

    await clientService.updateCustomerCentralPassword(props.clientId, payload);
    successToast("Senha alterada com sucesso.");
    close();
  } catch (error) {
    errorToast(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped></style>
