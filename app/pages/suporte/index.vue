<template>
  <div class="space-y-4">
    <!--
    filtro por cliente
    filtro por tipo (instalação, suporte, retirada)
    filtro por andamento (em aberto, concluido)

    -->

    <!-- <UTabs v-model="filter.status" :items="items"/> -->

    <div class="flex justify-end gap-4 items-center">
      <UButton
        icon="lucide:plus"
        label="Nova Ordem de Serviço"
        @click="openCreate"
      />
    </div>

    <UICard
      :loading="status === 'pending'"
      :data="data || []"
      :error="error"
      :page="page"
      :items-per-page="itemsPerPage"
      :total-elements="totalElements"
      @update:page="page = $event"
      @retry="refresh"
    >
    </UICard>
  </div>
</template>

<script setup lang="ts">
import Form from "~/components/Support/Form.vue";
import type { IServiceOrder } from "~/types/serviceOrder";
const overlay = useOverlay();

const { data, status, error, refresh } = useAsyncApi<IServiceOrder[]>(
  "fetch-suporte",
  "/suporte",
);

const page = ref<number>(0);
const itemsPerPage = ref<number>(10);
const totalElements = ref<number>(100);

const openCreate = () => {
  const modal = overlay.create(Form);
  modal.open({
    onRefresh: () => refresh(),
  });
};
</script>

<style scoped></style>
