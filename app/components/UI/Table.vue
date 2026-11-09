<template>
  <div class="overflow-hidden w-full min-w-0">
    <div class="w-full overflow-x-auto space-y-4">
      <UTable
        :data="data"
        :loading="loading"
        :columns="columns"
        v-model:column-visibility="columnVisibility"
        v-model:row-selection="internalRowSelection"
        :get-row-id="(row: any) => row.id"
        @select="(event: any, row: TableRow<T>) => emit('click', row.original)"
      >
        <template #loading>
          <UIRequestLoader message="Carregando..." />
        </template>

        <template #empty>
          <slot v-if="hasError" name="error">
            <UIRequestError :error="error" @retry="emit('retry')" />
          </slot>

          <slot v-else-if="isEmpty" name="empty">
            <UIRequestError :error="error" />
          </slot>
        </template>

        <template v-if="$slots.expanded" #expanded="{ row }">
          <slot name="expanded" :row="getRow(row)"></slot>
        </template>

        <template v-for="(_, name) in forwardedSlots" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps ?? {}" />
        </template>

        <slot />
      </UTable>

      <UCard>
        <div
          class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center text-sm text-muted"
        >
          <span class="hidden md:inline">
            Página {{ page }} de {{ Math.ceil(totalElements / itemsPerPage) }}
          </span>

          <div class="flex items-center justify-center">
            <UPagination
              :page="page + 1"
              @update:page="page = $event - 1"
              :items-per-page="itemsPerPage"
              :total="totalElements"
            />
          </div>

          <div
            class="w-auto flex gap-2 items-center justify-center md:justify-end"
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
                :model-value="itemsPerPage"
                :items="[10, 15, 20, 25]"
                @update:model-value="itemsPerPage = $event"
              />
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
import type { TableColumn, TableRow } from "@nuxt/ui";
import type { VisibilityState } from "@tanstack/vue-table";

const props = defineProps<{
  loading?: boolean;
  data: T[];
  error?: any;
  totalElements: number;

  columns: TableColumn<T>[];
  columnVisibility?: VisibilityState | undefined;
  rowSelection?: Record<string, boolean> | undefined;
}>();

const emit = defineEmits(["retry", "click", "update:rowSelection"]);

const page = defineModel<number>("page", { required: true });
const itemsPerPage = defineModel<number>("itemsPerPage", { required: true });

const columnVisibility = ref(props.columnVisibility);
const internalRowSelection = ref(props.rowSelection);

const hasData = computed(() => props.data.length > 0);

const hasError = computed(
  () => !props.loading && !!props.error && getErrorStatus(props.error) !== 404,
);

const isEmpty = computed(
  () =>
    !props.loading &&
    (props.data.length === 0 || getErrorStatus(props.error) === 404),
);

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

const slots = useSlots();

const forwardedSlots = computed(() => {
  const excluded = ["loading", "empty", "expanded"];
  return Object.fromEntries(
    Object.entries(slots).filter(([name]) => !excluded.includes(name)),
  );
});
</script>
