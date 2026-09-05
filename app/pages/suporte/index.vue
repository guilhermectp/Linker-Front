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
      <template #card-content="{ item }">
        <div class="space-y-4">
          <div class="flex items-start gap-3 min-w-0 flex-1">
            <div
              class="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
              :class="SERVICE_TYPE[item.tipo].bg"
            >
              <UIcon
                :name="SERVICE_TYPE[item.tipo].icon"
                class="w-4 h-4"
                :class="SERVICE_TYPE[item.tipo].iconColor"
              />
            </div>

            <div class="space-y-3">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold">
                  {{ SERVICE_TYPE[item.tipo].label }}
                </span>
                <UBadge
                  variant="subtle"
                  :color="SERVICE_STATUS[item.status].color"
                  :label="SERVICE_STATUS[item.status].label"
                />
              </div>

              <div class="flex items-center gap-4 text-sm text-muted flex-wrap">
                <span class="flex items-center gap-1">
                  <UIcon name="lucide:calendar-plus" class="w-3.5 h-3.5" />
                  Aberta em {{ item.dataAbertura }}
                </span>

                <span class="flex items-center gap-1">
                  <UIcon name="lucide:calendar-clock" class="w-3.5 h-3.5" />
                  Agendada para {{ isoToDateBR(item.dataAgendada) }}
                </span>
              </div>

              <p
                v-if="item.observacao"
                class="text-sm text-muted text-justify line-clamp-3"
              >
                <span class="font-medium">Observação:</span>
                {{ item.observacao }}
              </p>
            </div>
          </div>

          <USeparator />
          <div class="flex items-center justify-end gap-2">
            <UButton
              variant="customButton"
              color="success"
              size="sm"
              icon="lucide:printer"
              title="Imprimir"
            />
            <UButton
              variant="customButton"
              color="warning"
              size="sm"
              icon="lucide:pencil"
              title="Editar"
            />
            <UButton
              variant="customButton"
              color="error"
              size="sm"
              icon="lucide:trash-2"
              title="Excluir"
              @click="deleteSupport(item)"
              :loading="loadingDelete"
            />
          </div>
        </div>
      </template>
    </UICard>
  </div>
</template>

<script setup lang="ts">
import Form from "~/components/Support/Form.vue";
import ConfirmStatus from "~/components/UI/ConfirmStatus.vue";
import { SERVICE_STATUS, SERVICE_TYPE } from "~/constants/serviceOrder";
import { serviceService } from "~/services/service";
import type { IServiceOrder } from "~/types/serviceOrder";
const overlay = useOverlay();

const { data, status, error, refresh } = useAsyncApi<IServiceOrder[]>(
  "fetch-suporte",
  "/suporte",
);

const page = ref<number>(0);
const itemsPerPage = ref<number>(10);
const totalElements = ref<number>(100);

const loadingPDF = ref<boolean>(false);
const loadingDelete = ref<boolean>(false);

const openCreate = () => {
  const modal = overlay.create(Form);
  modal.open({
    onRefresh: () => refresh(),
  });
};

const deleteSupport = (item: IServiceOrder) => {
  const modal = overlay.create(ConfirmStatus);
  modal.open({
    itemType: "support",
    onConfirm: async () => {
      try {
        loadingDelete.value = true;

        await serviceService.delete(item.id);
        Toast.success("Ordem de Serviço deletada.");
        refresh();
      } catch (error) {
        Toast.error(error);
      } finally {
        loadingDelete.value = false;
      }
    },
  });
};
</script>

<style scoped></style>
