<template>
  <div class="mt-3 space-y-4">
    <UTable
      :data="data"
      :loading="loading"
      :columns="columns"
      :ui="mergedUi"
      v-model:column-visibility="columnVisibility"
      v-model:row-selection="internalRowSelection"
      :get-row-id="(row: any) => row.id"
    >
      <template #loading>
        <UIRequestLoader message="Carregando..." />
      </template>

      <template #empty>
        <UIRequestError :error="error" @retry="emit('retry')" />
      </template>

      <template v-if="$slots.expanded" #expanded="{ row }">
        <slot name="expanded" :row="getRow(row)"></slot>
      </template>

      <slot />
    </UTable>

    <UPagination
      v-if="hasData"
      :page="page + 1"
      :items-per-page="itemsPerPage"
      :total="totalElements"
      @update:page="(p: number) => emit('update:page', p - 1)"
      class="flex justify-center"
    />
  </div>
</template>

<script setup lang="ts" generic="T">
import type { TableColumn } from "@nuxt/ui";
import type { VisibilityState } from "@tanstack/vue-table";

const props = withDefaults(
  defineProps<{
    loading?: boolean;
    data: T[];
    error?: any;
    page: number;
    itemsPerPage?: number;
    totalElements?: number;
    ui?: any;
    columns: TableColumn<T>[];
    columnVisibility?: VisibilityState | undefined;
    rowSelection?: Record<string, boolean> | undefined;
  }>(),
  {
    itemsPerPage: 10,
    totalElements: undefined,
  },
);

const totalElements = computed(() => props.totalElements ?? props.data.length);

const columnVisibility = ref(props.columnVisibility);

const internalRowSelection = ref(props.rowSelection);

const emit = defineEmits([
  "update:page",
  "page",
  "retry",
  "update:rowSelection",
]);

const mergedUi = computed(() => ({
  ...props.ui,
}));

const hasData = computed(() => props.data.length > 0);

watch(
  () => props.columnVisibility,
  (newVal) => {
    columnVisibility.value = newVal;
  },
);

watch(internalRowSelection, (val) => {
  emit("update:rowSelection", val);
});

watch(
  () => props.rowSelection,
  (val) => {
    if (val) internalRowSelection.value = val;
  },
);

const getRow = (row: any) => {
  return row.original as T;
};
</script>
