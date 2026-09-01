<template>
  <div class="mt-3 space-y-4">
    <template v-if="loading">
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <USkeleton v-for="i in itemsPerPage" class="h-66.25" />
      </div>
    </template>

    <template v-else-if="error">
      <UIRequestError :error="error" @retry="emit('retry')" />
    </template>

    <template v-else>
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <slot :data="data">
          <UCard
            v-for="(item, index) in data"
            :key="index"
            class="group relative shadow-sm hover:shadow-md hover:ring-primary transition-all duration-300 cursor-pointer"
          >
            <slot name="card-content" :item="item">
              {{ item }}
            </slot>
          </UCard>
        </slot>
      </div>

      <div
        v-if="hasData"
        class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center p-4 border border-default rounded-md dark:bg-elevated"
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
    </template>
  </div>
</template>

<script setup lang="ts" generic="T">
const props = withDefaults(
  defineProps<{
    loading?: boolean;
    data: T[];
    error?: any;
    page: number;
    itemsPerPage?: number;
    totalElements?: number;
  }>(),
  {
    itemsPerPage: 10,
    totalElements: undefined,
  },
);

const emit = defineEmits(["update:page", "retry", "update:itemsPerPage"]);

const totalElements = computed(() => props.totalElements ?? props.data.length);

const hasData = computed(() => props.data.length > 0);
</script>
