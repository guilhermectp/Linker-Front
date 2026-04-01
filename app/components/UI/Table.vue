<template>
  <UTable
    :data="data"
    :loading="loading"
    :columns="columns"
    :ui="mergedUi"
    v-model:column-visibility="columnVisibility"
  >
    <template #loading>
      <FetchLoading message="Carregando..." />
    </template>

    <template #empty>
      <FetchError :type="typeError" :message="message" @retry="emit('retry')" />
    </template>

    <template v-if="$slots.expanded" #expanded="{ row }">
      <slot name="expanded" :row="row"></slot>
    </template>

    <slot />
  </UTable>

  <div v-if="hasData" class="flex justify-center py-4">
    <UPagination
      :page="page + 1"
      :items-per-page="itemsPerPage"
      :total="totalElements"
      @update:page="(p: number) => emit('update:page', p - 1)"
    />
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { VisibilityState } from "@tanstack/vue-table";
import type { TRequestError } from "~/types/requests";
import FetchLoading from "../FetchLoading.vue";

const props = defineProps<{
  loading?: boolean;
  data: any[];
  error?: TRequestError;
  emptyMessage?: string;
  columns: TableColumn<any>[];
  page: number;
  itemsPerPage: number;
  totalElements: number;
  ui?: any;
  columnVisibility?: VisibilityState | undefined;
}>();

const columnVisibility = ref(props.columnVisibility);

const emit = defineEmits(["update:page", "page", "retry"]);

const mergedUi = computed(() => ({
  // root: "shadow-sm border border-default rounded-xl",
  // tr: "hover:bg-elevated/80 dark:hover:bg-neutral-500/10 transition-all cursor-pointer",
  // th: "font-mono uppercase text-muted bg-accented tracking-wider text-xs",
  // td: "text-default text-sm tracking-wide",
  ...props.ui,
}));

const hasData = computed(
  () => !props.loading && !hasError.value && props.data.length > 0,
);

const hasError = computed(
  () => !!props.error && getErrorStatus(props.error) !== 404,
);

const typeError = computed(() => (hasError.value ? "error" : "empty"));

const message = computed(() => {
  return hasError.value
    ? getErrorMessage(props.error)
    : (props.emptyMessage ?? "Nenhum resultado encontrado.");
});

watch(
  () => props.columnVisibility,
  (newVal) => {
    columnVisibility.value = newVal;
  },
);
</script>
