<template>
  <UModal title="Novo Ponto">
    <template #body="{ close }">
      <UForm
        :state="state"
        :schema="connectionPointAddressSchema"
        class="space-y-6 max-w-2xl mx-auto"
        @submit.prevent="onSubmit(close)"
        ref="form"
        :disabled="isLoading"
      >
        <ClientFormAddress v-model="state" />

        <div class="flex justify-between pt-6">
          <UButton
            color="neutral"
            variant="ghost"
            label="Cancelar"
            @click="close"
          >
          </UButton>
          <UButton type="submit" label="Salvar" :loading="isLoading" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import {
  connectionPointAddressSchema,
  type TConnectionPointAddress,
} from "~/schema/connectionPoint";
import { connectionPointService } from "~/services/connectionPoint";
const toast = useToast();

const emit = defineEmits(["refresh"]);

const props = defineProps({
  connectionPointId: { type: String, required: true },
  currentAddress: {
    type: Object as PropType<TConnectionPointAddress>,
    required: true,
  },
});

const state = reactive<TConnectionPointAddress>({
  tipoEndereco: "URBANO",
  cep: "",
  cidade: "",
  bairro: "",
  rua: "",
  numero: 0,
  complemento: "",
  latitude: undefined,
  longitude: undefined,
});

const isLoading = ref<boolean>(false);

const onSubmit = async (close: () => void) => {
  try {
    isLoading.value = true;

    await connectionPointService.updateAddress(props.connectionPointId, state);

    toast.add({
      description: "Endereço alterado.",
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

onMounted(() => {
  console.log(props.currentAddress);
  if (props.currentAddress) Object.assign(state, props.currentAddress);
});
</script>

<style scoped></style>
