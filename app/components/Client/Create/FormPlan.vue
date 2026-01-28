<template>
  <div class="bg-muted border border-accented rounded-lg p-4 space-y-6">
    <UFormField label="Plano" name="ponto.planoId" required>
      <USelect
        v-model="model.ponto.planoId"
        :items="['Plano Residencial', 'Plano Gamer', 'Plano Empresarial']"
        class="w-full"
      />
    </UFormField>

    <UFormField label="Dia de Vencimento" name="ponto.diaVencimento" required>
      <USelect
        v-model="model.ponto.diaVencimento"
        :items="[5, 10, 15, 20, 25]"
        class="w-full"
      />
    </UFormField>

    <UFormField label="Usuario do Microtik" name="ponto.loginMK" required>
      <UInput v-model="model.ponto.loginMK" class="w-full" />
    </UFormField>

    <UFormField label="Senha do Microtik" name="ponto.senhaMK" required>
      <UInput v-model="model.ponto.senhaMK" class="w-full" />
    </UFormField>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>

<style scoped></style>
