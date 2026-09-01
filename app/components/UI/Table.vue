<template>
  <div class="mt-3">
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

    <div
      v-if="hasData"
      class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center p-4 border border-t-0 border-default rounded-b-md dark:bg-elevated"
    >
      <span class="hidden md:inline text-sm text-muted">
        Página {{ page }} de {{ Math.ceil(totalElements / itemsPerPage) }}
      </span>

      <div class="flex items-center justify-center">
        <UPagination
          :page="page"
          :items-per-page="itemsPerPage"
          :total="totalElements"
          @update:page="(p: number) => emit('update:page', p)"
        />
      </div>

      <div
        class="w-auto flex gap-2 items-center justify-center md:justify-end text-muted text-sm"
      >
        <div class="flex items-center gap-2">
          <Icon name="lucide:database" class="size-4" />
          <span>
            <span class="font-medium text-foreground">
              {{ totalElements.toLocaleString() }}
            </span>
            resultados
          </span>
        </div>

        <USeparator class="h-4" orientation="vertical" />

        <div class="flex items-center gap-2">
          <span>Itens</span>
          <USelect
            :default-value="itemsPerPage"
            :items="[10, 15, 20, 25]"
            @update:modelValue="(v: number) => emit('update:itemsPerPage', v)"
          />
        </div>
      </div>
    </div>
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
  "update:itemsPerPage",
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
