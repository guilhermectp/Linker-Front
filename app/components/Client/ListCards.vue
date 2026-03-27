<template>
  <div
    v-if="loading"
    class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
  >
    <div
      v-for="i in 3"
      :key="i"
      class="bg-elevated border border-default rounded-xl p-5 animate-pulse space-y-4"
    >
      <div class="flex justify-between">
        <div class="h-5 w-16 bg-accented rounded-full" />

        <div class="h-7 w-7 bg-accented rounded-md" />
      </div>
      <div class="h-5 w-2/3 bg-accented rounded" />
      <div class="space-y-2">
        <div class="h-3 bg-accented rounded w-full" />
        <div class="h-3 bg-accented rounded w-4/5" />
        <div class="h-3 bg-accented rounded w-3/5" />
        <div class="h-3 bg-accented rounded w-4/5" />
      </div>
    </div>
  </div>

  <FetchError
    v-if="error || data.length === 0"
    :type="error ? 'error' : 'empty'"
    :message="error ? getErrorMessage(error) : emptyMessage"
    @retry="emit('refresh')"
  />

  <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
    <UCard
      v-for="(client, index) in data"
      :key="client.id ?? index"
      class="group relative bg-muted rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:ring-accent-400 hover:shadow-[0_4px_24px_rgba(0,0,0,0.18)]"
      :ui="{
        header: 'border-0 pt-4 pb-0!',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="font-bold text-lg text-highlighted">
            {{ client.nome }}
          </h1>

          <UButton
            class="rounded-md"
            trailing-icon="lucide:arrow-right"
            color="info"
            variant="ghost"
            aria-label="Actions dropdown"
            @click="navigateTo(`/clientes/${client.id}`)"
          />
        </div>
      </template>

      <dl class="flex flex-col gap-3">
        <div class="flex gap-2 text-sm">
          <dt class="text-muted min-w-18 shrink-0">Email:</dt>
          <dd class="text-default font-medium">{{ client.email }} Mbps</dd>
        </div>
        <div class="flex gap-2 text-sm">
          <dt class="text-muted min-w-18 shrink-0">Telefone:</dt>
          <dd class="text-default font-medium">{{ client.telefone }} Mbps</dd>
        </div>
        <div class="flex gap-2 text-sm">
          <dt class="text-muted min-w-18 shrink-0">Cadastro:</dt>
          <dd>
            <UBadge
              variant="soft"
              :label="client.status"
              class="rounded-full px-4"
            />
          </dd>
        </div>
        <div class="flex gap-2 text-[13px]">
          <dt class="text-muted min-w-18 shrink-0">Situação:</dt>
          <dd class="text-default font-medium break-all">
            <UBadge
              variant="soft"
              :label="client.status"
              class="rounded-full px-4"
            />
          </dd>
        </div>
      </dl>
    </UCard>
  </div>

  <div v-if="data" class="flex justify-center pt-2">
    <UPagination
      :page="page + 1"
      :items-per-page="itemsPerPage"
      :total="totalElements"
      @update:page="(p: number) => emit('update:page', p - 1)"
    />
  </div>
</template>

<script setup lang="ts">
import type { TRequestError } from "~/types/requests";
import type { TGetCliente } from "~/types/clients";

const toast = useToast();
const overlay = useOverlay();

const emit = defineEmits(["update:page", "refresh"]);

const props = defineProps<{
  loading?: boolean;
  data: TGetCliente[];
  error?: TRequestError;
  page: number;
  itemsPerPage: number;
  totalElements: number;
  ui?: any;
}>();

const emptyMessage = computed(() => {
  return getErrorMessage(props.error) ?? "Nenhum cliente encontrado";
});
</script>

<style scoped></style>
