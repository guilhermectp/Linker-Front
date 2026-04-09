<template>
  <UModal :title="title" class="max-w-2xl">
    <template #body="{ close }">
      <UForm
        :schema="stepSchemas[currentStepIndex]"
        :state="state"
        class="space-y-6 mx-auto"
        @submit.prevent="onSubmit(close)"
        ref="form"
        :disabled="isLoading"
      >
        <UStepper
          v-model="currentStepIndex"
          :items="items"
          linear
          :disabled="true"
        >
          <template #plan>
            <ClientFormPlan v-model="state.ponto" :is-editing="isEditing" />
          </template>

          <template #address>
            <ClientFormAddress
              v-model="state.ponto.endereco"
              :is-editing="isEditing"
            />
          </template>
        </UStepper>

        <div class="flex justify-between pt-6">
          <UButton
            color="neutral"
            variant="ghost"
            @click="handleBack(close)"
            :disabled="isLoading"
          >
            {{ isFirstStep ? "Cancelar" : "Voltar" }}
          </UButton>

          <UButton v-if="!isLastStep" label="Avançar" @click="handleNext" />

          <UButton
            v-else
            type="submit"
            :label="submitLabel"
            :loading="isLoading"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { StepperItem } from "@nuxt/ui";
import {
  connectionPointAddressSchema,
  connectionPointPlanCreateSchema,
  connectionPointPlanSchema,
  type TCreateConnectionPoint,
  type TUpdateConnectionPoint,
} from "~/schema/connectionPoint";
import { connectionPointService } from "~/services/connectionPoint";
const { successToast, errorToast } = useAppToast();

const props = defineProps({
  clientId: { type: String },
  connectionPointId: { type: String },
  pointToEdit: {
    type: Object as PropType<TUpdateConnectionPoint>,
  },
});

const items = [
  {
    slot: "plan" as const,
    title: "Plano e Acesso",
    icon: "lucide:wifi",
  },
  {
    slot: "address" as const,
    title: "Endereço",
    icon: "lucide:map-pin",
  },
] satisfies StepperItem[];

const form = ref();

const defaultState = (): TCreateConnectionPoint => ({
  ponto: {
    planoId: "",
    diaVencimento: 5,
    loginMK: "",
    senhaMK: "",
    endereco: {
      tipoEndereco: "URBANO",
      cep: "",
      cidade: "",
      bairro: "",
      rua: "",
      numero: undefined as unknown as number,
    },
  },
});

const state = reactive<TCreateConnectionPoint>(defaultState());

const originalState = ref<TUpdateConnectionPoint | {}>({});

const currentStepIndex = ref(0);

const isEditing = computed(() => !!props.pointToEdit);

const stepSchemas = computed(() => [
  isEditing.value ? connectionPointPlanSchema : connectionPointPlanCreateSchema,
  connectionPointAddressSchema,
]);

const title = computed(() =>
  isEditing.value ? "Editando Ponto" : "Adicionando Ponto",
);
const submitLabel = computed(() => (isEditing.value ? "Salvar" : "Adicionar"));
const isFirstStep = computed(() => currentStepIndex.value === 0);
const isLastStep = computed(() => currentStepIndex.value === items.length - 1);

const handleBack = (close: () => void) => {
  if (isFirstStep.value) {
    close();
    return;
  }

  currentStepIndex.value--;
};

const handleNext = async () => {
  try {
    await form.value?.validate();
  } catch (error) {
    return;
  }

  if (!isLastStep.value) {
    currentStepIndex.value++;
  }
};

const isLoading = ref<boolean>(false);

const onSubmit = async (close: () => void) => {
  try {
    await form.value?.validate();
  } catch (error) {
    return;
  }

  isLoading.value = true;

  try {
    if (isEditing.value) {
      const payload = getChangedFields(
        originalState.value as Record<string, unknown>,
        state as Record<string, unknown>,
      ) as TUpdateConnectionPoint;

      if (Object.keys(payload).length === 0) {
        close();
        return;
      }

      await connectionPointService.update(props.connectionPointId!, payload);
    } else {
      await connectionPointService.create(props.clientId!, state);
    }

    successToast(
      isEditing.value ? "Ponto atualizado." : "Novo ponto adicionado.",
    );
    close();
  } catch (error) {
    errorToast(error);
  } finally {
    isLoading.value = false;
  }
};

watchEffect(() => {
  if (props.pointToEdit) {
    Object.assign(state, props.pointToEdit);

    originalState.value = structuredClone(toRaw(props.pointToEdit));
  }
});
</script>

<style scoped></style>
