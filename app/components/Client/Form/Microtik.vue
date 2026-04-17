<template>
  <div class="bg-muted border border-accented rounded-lg p-4 space-y-6">
    <UFormField label="Usuario do Microtik" name="loginMK" required>
      <UInput v-model="model.loginMK" class="w-full" />
    </UFormField>

    <UFormField
      label="Senha do Microtik"
      name="senhaMK"
      :required="!isEditMode"
    >
      <UInput v-model="model.senhaMK" class="w-full" />
    </UFormField>
  </div>
</template>

<script setup lang="ts">
import type {
  TConnectionPointMicrotik,
  TConnectionPointUpdateMicrotik,
} from "~/schema/connectionPoint";

const props = defineProps({
  modelValue: {
    type: Object as PropType<
      TConnectionPointMicrotik | TConnectionPointUpdateMicrotik
    >,
    required: true,
  },
  isEditMode: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>

<style scoped></style>
