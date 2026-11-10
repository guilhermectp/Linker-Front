<template>
  <div class="space-y-4">
    <template v-if="loading">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <USkeleton v-for="i in itemsPerPage" class="h-66.25" />
      </div>
    </template>

    <template v-else-if="error">
      <UIRequestError :error="error" @retry="emit('retry')" />
    </template>

    <template v-else-if="hasData">
      <slot :data="data">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UCard
            v-for="(item, index) in data"
            :key="index"
            :ui="{ body: 'flex-1 flex flex-col' }"
            class="group relative shadow-sm hover:shadow-md hover:ring-primary transition-all duration-300 h-full flex flex-col"
          >
            <template #header>
              <slot name="card-header" :item="item" />
            </template>

            <slot name="card-content" :item="item" />

            <template #footer>
              <slot name="card-footer" :item="item" />
            </template>
          </UCard>
        </div>
      </slot>

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
    </template>
  </div>
</template>

<script setup lang="ts" generic="T">
const props = defineProps<{
  loading?: boolean;
  data: T[];
  error?: any;
  totalElements: number;
}>();

const emit = defineEmits(["retry"]);

const page = defineModel<number>("page", { required: true });
const itemsPerPage = defineModel<number>("itemsPerPage", { required: true });

const hasData = computed(() => props.data.length > 0);
</script>
