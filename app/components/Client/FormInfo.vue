<template>
  <div class="bg-muted border border-accented rounded-lg p-4 space-y-6">
    <UFormField label="CPF" name="cpf" required>
      <UInput
        v-model="model.cpf"
        class="w-full"
        size="lg"
        placeholder="xxx.xxx.xxx-xx"
        v-maska="'###.###.###-##'"
        :disabled="isEditing"
      />
    </UFormField>

    <UFormField label="Nome" name="nome" required>
      <UInput
        v-model="model.nome"
        class="w-full"
        size="lg"
        placeholder="Nome Sobrenome"
      />
    </UFormField>

    <UFormField label="Email" name="email" required>
      <UInput
        v-model="model.email"
        class="w-full"
        size="lg"
        placeholder="nome@email.com"
      />
    </UFormField>

    <UFormField label="Telefone" name="telefone" required>
      <UInput
        v-model="model.telefone"
        class="w-full"
        size="lg"
        placeholder="(67) 91234-5678"
        v-maska="'(##) #####-####'"
      />
    </UFormField>

    <UFormField
      label="Senha de acesso ao portal do cliente"
      name="senhaCentralCliente"
      :required="props.isEditing ? false : true"
    >
      <UInput
        v-model="model.senhaCentralCliente"
        class="w-full"
        size="lg"
        placeholder="********"
      />
    </UFormField>
  </div>
</template>

<script setup lang="ts">
import { vMaska } from "maska/vue";
import type { TFormCliente } from "~/types/clients";

const props = defineProps({
  modelValue: { type: Object as PropType<TFormCliente>, required: true },
  isEditing: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>

<style scoped></style>
