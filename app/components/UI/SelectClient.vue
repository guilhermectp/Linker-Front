<template>
  <USelectMenu
    v-model="model"
    :items="data"
    label-key="nome"
    value-key="id"
    :placeholder="placeholder"
    icon="lucide:user"
    class="w-full"
    :loading="isLoading"
    :disabled="isLoading"
    :search-input="{
      placeholder: 'Buscar por nome ou cpf...',
      icon: 'i-lucide-search',
    }"
    :filter-fields="['nome', 'cpf']"
    :clear="!disabled && !!model"
    :multiple="multiple"
  >
    <template #item="{ item }">
      <div class="flex items-center gap-3 py-1 w-full">
        <div class="flex flex-col flex-1">
          <span class="font-medium">{{ item.nome }}</span>
          <span class="text-xs text-muted">CPF: {{ item.cpf }}</span>
        </div>

        <UIcon
          v-if="model?.includes(item.id)"
          name="lucide:check"
          class="size-4"
        />
      </div>
    </template>

    <template #empty>
      <div class="text-center text-muted">Nenhum usuário encontrado.</div>
    </template>
  </USelectMenu>
</template>
<script setup lang="ts">
import type { Cliente } from "~/types/clients";

const model = defineModel<string | string[] | null | undefined>();

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    multiple?: boolean;
    disabled?: boolean;
    idAdministrator?: string;
  }>(),
  {
    placeholder: "Selecione um cliente",
    multiple: false,
    disabled: false,
  },
);

const { data, status, error, refresh } = await useAsyncApi<Cliente[]>(
  `fetch-clientes-sem-paginacao`,
  "/clientes/sem-paginacao",
);

const isLoading = computed(() => status.value === "pending");
</script>
