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
        <div class="flex gap-1">
          <div class="h-7 w-7 bg-accented rounded-md" />
          <div class="h-7 w-7 bg-accented rounded-md" />
          <div class="h-7 w-7 bg-accented rounded-md" />
        </div>
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
      v-for="(plan, index) in data"
      :key="plan.id ?? index"
      class="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:ring-primary-400 hover:shadow-[0_4px_24px_rgba(0,0,0,0.18)]"
      :ui="{
        header: 'border-0 pt-4 pb-0!',
      }"
    >
      <template #header>
        <!-- <div
          class="absolute top-0 left-0 right-0 h-0.75 bg-primary-400 scale-x-0 origin-left transition-transform duration-200 group-hover:scale-x-100"
        /> -->

        <div class="flex items-center justify-between">
          <UBadge
            :label="`# ${index + 1}`"
            variant="subtle"
            class="px-3 rounded-full tracking-widest"
          />

          <div class="space-x-2">
            <UButton
              class="rounded-md bg-accented text-muted transition-all duration-300 hover:bg-info-400/15 hover:text-info-400"
              title="Copiar nome"
              @click="handleCopy(plan)"
              icon="lucide:copy"
              size="sm"
            />
            <UButton
              class="rounded-md bg-accented text-muted transition-all duration-300 hover:bg-warn-500/15 hover:text-warn-500"
              title="Editar plano"
              @click="openFormModalToEdit(plan)"
              icon="lucide:pencil"
              size="sm"
            />
            <UButton
              class="rounded-md bg-accented text-muted transition-all duration-300 hover:bg-danger-500/15 hover:text-danger-500"
              title="Excluir plano"
              @click="openDeleteModal(plan)"
              icon="lucide:trash-2"
              size="sm"
            />
          </div>
        </div>
      </template>

      <h1 class="font-bold text-lg text-highlighted mb-3">
        {{ plan.nome }}
      </h1>

      <dl class="flex flex-col gap-3">
        <div class="flex gap-2 text-sm">
          <dt class="text-muted min-w-18 shrink-0">Download:</dt>
          <dd class="text-default font-medium">{{ plan.downloadMB }} Mbps</dd>
        </div>
        <div class="flex gap-2 text-sm">
          <dt class="text-muted min-w-18 shrink-0">Upload:</dt>
          <dd class="text-default font-medium">{{ plan.uploadMB }} Mbps</dd>
        </div>
        <div class="flex gap-2 text-sm">
          <dt class="text-muted min-w-18 shrink-0">Valor:</dt>
          <dd class="font-medium text-primary dark:text-primary-400">
            {{ formatCurrency(plan.valor) }}/mês
          </dd>
        </div>
        <div class="flex gap-2 text-sm">
          <dt class="text-muted min-w-18 shrink-0">Descrição:</dt>
          <dd class="text-default font-medium break-all">
            {{ plan.descricao }}
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
import type { TPlan } from "~/types/plan";
import type { TRequestError } from "~/types/requests";
import { useClipboard } from "@vueuse/core";
import PlanFormModal from "~/components/Plan/FormModal.vue";
import PlanDeleteModal from "~/components/Plan/DeleteModal.vue";

const toast = useToast();
const overlay = useOverlay();
const { copy } = useClipboard();

const emit = defineEmits(["update:page", "refresh"]);

const props = defineProps<{
  loading?: boolean;
  data: TPlan[];
  error?: TRequestError;
  page: number;
  itemsPerPage: number;
  totalElements: number;
  ui?: any;
}>();

const emptyMessage = computed(() => {
  return getErrorMessage(props.error) ?? "Nenhum plano encontrado";
});

const formatCurrency = (val: number | string) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(val));

const handleCopy = (plan: TPlan) => {
  copy(plan.nome);

  toast.add({
    title: "Plano copiado!",
    color: "success",
    icon: "i-lucide-circle-check",
  });
};

const openFormModalToCreate = () => {
  const modal = overlay.create(PlanFormModal);
  modal.open({ onRefresh: async () => emit("refresh") });
};

const openFormModalToEdit = (plan: TPlan) => {
  const modal = overlay.create(PlanFormModal);
  modal.open({
    plan: plan,
    onRefresh: async () => emit("refresh"),
  });
};

const openDeleteModal = (plan: TPlan) => {
  const modal = overlay.create(PlanDeleteModal);
  modal.open({
    plan: plan,
    onRefresh: async () => emit("refresh"),
  });
};
</script>

<style scoped></style>
