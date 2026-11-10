<template>
  <div class="space-y-8">
    <div class="flex flex-wrap justify-between items-center gap-4">
      <UInput
        v-model="searchBy"
        placeholder="Buscar por plano"
        class="flex-1 min-w-72"
        size="lg"
      />

      <UFieldGroup size="lg">
        <UButton
          color="neutral"
          :variant="currentView === 'table' ? 'subtle' : 'outline'"
          icon="lucide:table"
          @click="currentView = 'table'"
        />
        <UButton
          color="neutral"
          :variant="currentView === 'cards' ? 'subtle' : 'outline'"
          icon="lucide:layout-grid"
          @click="currentView = 'cards'"
        />
      </UFieldGroup>

      <UButton
        label="Novo"
        icon="i-lucide:plus"
        @click="openFormModalToCreate"
        size="lg"
      />
    </div>

    <template v-if="currentView === 'table'">
      <UITable
        :loading="status === 'pending'"
        :data="data?.data || []"
        :error="error"
        :columns="columns"
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
        :total-elements="totalElements"
        @retry="refresh"
      />
    </template>
    <template v-else>
      <UICard
        :loading="status === 'pending'"
        :data="data?.data || []"
        :error="error"
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
        :total-elements="totalElements"
        @retry="refresh"
      >
        <template #card-header="{ item }">
          <UTooltip :text="item.nome">
            <h1 class="font-bold text-lg text-highlighted line-clamp-1">
              {{ item.nome }}
            </h1>
          </UTooltip>
        </template>

        <template #card-content="{ item }">
          <dl class="flex flex-col gap-3">
            <div class="flex gap-2 text-sm">
              <dt class="text-muted min-w-18 shrink-0">Download:</dt>
              <dd class="text-default font-medium">
                {{ item.downloadMB }} Mbps
              </dd>
            </div>
            <div class="flex gap-2 text-sm">
              <dt class="text-muted min-w-18 shrink-0">Upload:</dt>
              <dd class="text-default font-medium">{{ item.uploadMB }} Mbps</dd>
            </div>
            <div class="flex gap-2 text-sm">
              <dt class="text-muted min-w-18 shrink-0">Valor:</dt>
              <dd class="font-medium text-primary dark:text-primary-400">
                {{ formatCurrency(item.valor) }}/mês
              </dd>
            </div>
            <div class="flex gap-2 text-sm">
              <dt class="text-muted min-w-18 shrink-0">Descrição:</dt>
              <UTooltip :text="item.descricao">
                <dd class="text-default font-medium break-all line-clamp-2">
                  {{ item.descricao }}
                </dd>
              </UTooltip>
            </div>
          </dl>
        </template>

        <template #card-footer="{ item }">
          <div class="flex items-center justify-end gap-2">
            <UButton
              color="success"
              @click="handleCopy(item)"
              title="Copiar nome"
              icon="lucide:copy"
              size="sm"
              variant="subtle"
            />
            <UButton
              color="warning"
              title="Editar"
              @click="openFormModalToEdit(item)"
              icon="lucide:pencil"
              size="sm"
              variant="subtle"
            />
            <UButton
              color="error"
              title="Excluir"
              @click="openDeleteModal(item)"
              icon="lucide:trash-2"
              size="sm"
              variant="subtle"
            />
          </div>
        </template>
      </UICard>
    </template>
  </div>
</template>

<script setup lang="ts">
import { type Row } from "@tanstack/vue-table";
import type { TableColumn } from "@nuxt/ui";
import { useClipboard } from "@vueuse/core";
import type { FetchPlanos, Plano } from "~/types/plan";
import PlanFormModal from "~/components/Plan/FormModal.vue";
import ConfirmStatus from "~/components/UI/ConfirmStatus.vue";
import { planService } from "~/services/plan";
import RequestLoader from "~/components/UI/RequestLoader.vue";

const UDropdownMenu = resolveComponent("UDropdownMenu");
const UButton = resolveComponent("UButton");
const { copy } = useClipboard();
const overlay = useOverlay();
const toast = useToast();

const currentView = ref<"cards" | "table">("table");

const searchBy = ref("");
const searchByDebounced = useDebounce(searchBy, 600);

const page = ref<number>(1);
const itemsPerPage = ref<number>(10);
const totalElements = ref<number>(0);

const { data, status, error, refresh } = await useAsyncApi<FetchPlanos>(
  `planos-fetch`,
  "/planos",
  {
    query: {
      pagina: page.value,
      itemsPorPagina: itemsPerPage.value,
      busca: () => searchByDebounced.value || undefined,
    },
    watch: [page, itemsPerPage, searchByDebounced],
  },
);

watch(
  [searchByDebounced, itemsPerPage],
  () => {
    page.value = 0;
  },
  { flush: "sync" },
);

watch(data, (newValue) => {
  if (newValue) totalElements.value = newValue.total;
});

const columns: TableColumn<Plano>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "downloadMB",
    header: "Download (MB)",
  },
  {
    accessorKey: "uploadMB",
    header: "Upload (MB)",
  },
  {
    accessorKey: "valor",
    header: "Valor/mês",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("valor"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);
      return h(
        "span",
        { class: "text-primary font-medium" },
        `${formatted}/mês`,
      );
    },
  },
  {
    accessorKey: "descricao",
    header: "Descrição",
    meta: {
      class: {
        th: "w-0",
      },
    },
    cell: ({ row }) => {
      const descricao = row.getValue("descricao") as string;
      return h(
        resolveComponent("UTooltip"),
        { text: descricao },
        {
          default: () =>
            h("span", { class: "max-w-sm truncate block" }, descricao),
        },
      );
    },
  },
  {
    id: "actions",
    meta: {
      class: {
        td: "text-right",
      },
    },
    cell: ({ row }) => {
      return h(
        UDropdownMenu,
        {
          content: {
            align: "end",
          },
          items: getRowItems(row),
          "aria-label": "Actions dropdown",
        },
        () =>
          h(UButton, {
            icon: "i-lucide-ellipsis-vertical",
            color: "neutral",
            variant: "ghost",
            "aria-label": "Actions dropdown",
          }),
      );
    },
  },
];

const getRowItems = (row: Row<Plano>) => {
  return [
    {
      label: "Copiar",
      icon: "lucide:copy",
      onSelect() {
        copy(row.original.nome);
        toast.add({
          title: "Plano copiado!",
          color: "success",
          icon: "i-lucide-circle-check",
        });
      },
    },
    {
      label: "Editar",
      icon: "lucide:pen-line",
      onSelect() {
        openFormModalToEdit(row.original);
      },
    },
    {
      label: "Deletar",
      icon: "lucide:trash-2",
      onSelect() {
        openDeleteModal(row.original);
      },
    },
  ];
};

const formatCurrency = (val: number | string) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(val));

const handleCopy = (plan: Plano) => {
  copy(plan.nome);

  toast.add({
    title: "Plano copiado!",
    color: "success",
    icon: "i-lucide-circle-check",
  });
};

const openFormModalToCreate = () => {
  const modal = overlay.create(PlanFormModal);
  modal.open({ onRefresh: () => refresh() });
};

const openFormModalToEdit = (plan: Plano) => {
  const modal = overlay.create(PlanFormModal);
  modal.open({
    plan: plan,
    onRefresh: () => refresh(),
  });
};

const openDeleteModal = (plan: Plano) => {
  const modal = overlay.create(ConfirmStatus);
  const modalLoading = overlay.create(RequestLoader);

  modal.open({
    itemType: "plan",
    itemName: plan.nome,
    onConfirm: async () => {
      try {
        modalLoading.open({ message: `Excluindo o plano: ${plan.nome}...` });

        await planService.delete(plan.nome);

        toast.add({
          description: "Plano deletado com sucesso",
          color: "success",
        });

        refresh();
      } catch (error) {
        toast.add({
          description: getErrorMessage(error),
          color: "error",
        });
      } finally {
        modalLoading.close();
      }
    },
  });
};
</script>
