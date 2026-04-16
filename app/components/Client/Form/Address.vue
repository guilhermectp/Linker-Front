<template>
  <div class="bg-muted border border-accented rounded-lg p-4 space-y-6">
    <UFormField label="Localidade" name="tipoEndereco" required>
      <URadioGroup
        v-model="model.tipoEndereco"
        orientation="horizontal"
        variant="card"
        :items="items"
        @update:model-value="(e) => toggleAddressType(e as TTipoEndereco)"
      />
    </UFormField>

    <div v-if="model.tipoEndereco === 'URBANO'" class="grid grid-cols-2 gap-6">
      <UFormField label="CEP" name="cep" required>
        <UInput v-model="model.cep" class="w-full" v-maska="'##.###-###'" />
      </UFormField>

      <UFormField label="Município" name="cidade" required>
        <UInput v-model="model.cidade" class="w-full" />
      </UFormField>

      <UFormField label="Bairro" name="bairro" required>
        <UInput v-model="model.bairro" class="w-full" />
      </UFormField>

      <UFormField label="Rua" name="rua" required>
        <UInput v-model="model.rua" class="w-full" />
      </UFormField>

      <UFormField label="Número" name="numero" required>
        <UInputNumber
          v-model="model.numero"
          :min="1"
          :increment="false"
          :decrement="false"
          class="w-full"
        />
      </UFormField>
    </div>

    <div v-else class="grid grid-cols-2 gap-6">
      <UFormField
        label="Cidade/Vila/Povoado de referência"
        name="cidadeReferencia"
        required
      >
        <UInput v-model="model.cidadeReferencia" class="w-full" />
      </UFormField>
      <UFormField
        label="Nome da Fazenda/Chácara/Sítio"
        name="nomeLocal"
        required
      >
        <UInput v-model="model.nomeLocal" class="w-full" />
      </UFormField>
    </div>

    <div class="grid grid-cols-2 gap-6">
      <UFormField label="Complemento" name="complemento">
        <UInput v-model="model.complemento" class="w-full" />
      </UFormField>

      <UFormField label="Latitude" name="latitude">
        <UInputNumber
          v-model="model.latitude"
          :increment="false"
          :decrement="false"
        />
      </UFormField>

      <UFormField label="Longitude" name="longitude">
        <UInputNumber
          v-model="model.longitude"
          :increment="false"
          :decrement="false"
        />
      </UFormField>
    </div>
  </div>
</template>

<script setup lang="ts">
import { vMaska } from "maska/vue";
import type { TConnectionPointAddress } from "~/schema/connectionPoint";
import type { TTipoEndereco } from "~/types/connectionPoint";

const props = defineProps({
  modelValue: {
    type: Object as PropType<TConnectionPointAddress>,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const items = [
  { label: "Área Urbana", value: "URBANO" },
  { label: "Área Rural", value: "RURAL" },
];

const createUrbanAddress = () => ({
  tipoEndereco: "URBANO" as const,
  cep: "",
  cidade: "",
  bairro: "",
  rua: "",
  numero: 0,
  complemento: "",
  latitude: undefined,
  longitude: undefined,
});

const createRuralAddress = () => ({
  tipoEndereco: "RURAL" as const,
  cidadeReferencia: "",
  nomeLocal: "",
  complemento: "",
  latitude: undefined,
  longitude: undefined,
});

const toggleAddressType = (tipo: TTipoEndereco) => {
  model.value = tipo === "URBANO" ? createUrbanAddress() : createRuralAddress();
};
</script>

<style scoped></style>
