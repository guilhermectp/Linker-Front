<template>
  <div class="bg-muted border border-accented rounded-lg p-4 space-y-6">
    <UFormField label="Localidade" name="ponto.endereco.tipoEndereco" required>
      <URadioGroup
        v-model="model.ponto.endereco.tipoEndereco"
        orientation="horizontal"
        variant="card"
        default-value="URBANO"
        :items="items"
      />
    </UFormField>

    <div
      v-if="model.ponto.endereco.tipoEndereco === 'URBANO'"
      class="grid grid-cols-2 gap-6"
    >
      <UFormField label="CEP" name="ponto.endereco.cep" required>
        <UInput v-model="model.ponto.endereco.cep" class="w-full" />
      </UFormField>

      <UFormField label="Município" name="ponto.endereco.cidade" required>
        <UInput v-model="model.ponto.endereco.cidade" class="w-full" />
      </UFormField>

      <UFormField label="Bairro" name="ponto.endereco.bairro" required>
        <UInput v-model="model.ponto.endereco.bairro" class="w-full" />
      </UFormField>

      <UFormField label="Rua" name="ponto.endereco.rua" required>
        <UInput v-model="model.ponto.endereco.rua" class="w-full" />
      </UFormField>

      <UFormField label="Número" name="ponto.endereco.numero" required>
        <UInputNumber
          v-model="model.ponto.endereco.numero"
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
        name="ponto.endereco.cidadeReferencia"
        required
      >
        <UInput
          v-model="model.ponto.endereco.cidadeReferencia"
          class="w-full"
        />
      </UFormField>
      <UFormField
        label="Nome da Fazenda/Chácara/Sítio"
        name="ponto.endereco.nomeLocal"
        required
      >
        <UInput v-model="model.ponto.endereco.nomeLocal" class="w-full" />
      </UFormField>
    </div>

    <div class="grid grid-cols-2 gap-6">
      <UFormField
        label="Complemento"
        name="ponto.endereco.complemento"
        :required="model.ponto.endereco.tipoEndereco === 'RURAL'"
      >
        <UInput v-model="model.ponto.endereco.complemento" class="w-full" />
      </UFormField>

      <UFormField label="Latitude" name="ponto.endereco.latitude">
        <UInput v-model="model.ponto.endereco.latitude" class="w-full" />
      </UFormField>

      <UFormField label="Longitude" name="ponto.endereco.longitude">
        <UInput v-model="model.ponto.endereco.longitude" class="w-full" />
      </UFormField>
    </div>
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

const items = [
  { label: "Área Urbana", value: "URBANO" },
  { label: "Área Rural", value: "RURAL" },
];

const toggleAddressType = (tipo: "URBANO" | "RURAL") => {
  if (tipo === "URBANO") {
    model.value.ponto.endereco = {
      tipoEndereco: "URBANO",
      cep: "",
      cidade: "",
      bairro: "",
      rua: "",
      numero: 0,
      latitude: "",
      longitude: "",
    };
  } else {
    model.value.ponto.endereco = {
      tipoEndereco: "RURAL",
      cidadeReferencia: "",
      nomeLocal: "",
      complemento: "",
      latitude: "",
      longitude: "",
    };
  }
};
</script>

<style scoped></style>
