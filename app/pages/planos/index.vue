<template>
  <div class="space-y-8">
    <div class="flex flex-wrap justify-between items-center gap-4">
      <UInput
        v-model="globalFilter"
        placeholder="Buscar por nome, descrição ou valor"
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
        :data="data || []"
        :error="error"
        :columns="columns"
        :page="page"
        :items-per-page="itemsPerPage"
        :total-elements="totalElements"
        @update:page="page = $event"
        @retry="refresh"
      />
    </template>
    <template v-else>
      <PlanListCards
        :loading="status === 'pending'"
        :data="data || []"
        :error="error"
        :page="page"
        :items-per-page="itemsPerPage"
        :total-elements="totalElements"
        @update:page="page = $event"
        @refresh="refresh"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { type Row } from "@tanstack/vue-table";
import type { TableColumn } from "@nuxt/ui";
import { useClipboard } from "@vueuse/core";
import type { TPlan } from "~/types/plan";
import PlanFormModal from "~/components/Plan/FormModal.vue";
import PlanDeleteModal from "~/components/Plan/DeleteModal.vue";

const UDropdownMenu = resolveComponent("UDropdownMenu");
const UButton = resolveComponent("UButton");
const { copy } = useClipboard();
const overlay = useOverlay();
const toast = useToast();

const currentView = ref<"cards" | "table">("table");

const page = ref<number>(0);
const itemsPerPage = ref<number>(10);
const totalElements = ref<number>(100);

const globalFilter = ref("");

const { data, status, error, refresh } = await useAsyncApi<TPlan[]>(
  `plans-fetch-all-page`,
  "/planos",
);

const columns: TableColumn<TPlan>[] = [
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

const getRowItems = (row: Row<TPlan>) => {
  return [
    {
      label: "Copiar",
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
      onSelect() {
        openFormModalToEdit(row.original);
      },
    },
    {
      label: "Deletar",
      onSelect() {
        openDeleteModal(row.original);
      },
    },
  ];
};

const openFormModalToCreate = () => {
  const modal = overlay.create(PlanFormModal);
  modal.open({ onRefresh: () => refresh() });
};

const openFormModalToEdit = (plan: TPlan) => {
  const modal = overlay.create(PlanFormModal);
  modal.open({
    plan: plan,
    onRefresh: () => refresh(),
  });
};

const openDeleteModal = (plan: TPlan) => {
  const modal = overlay.create(PlanDeleteModal);
  modal.open({
    plan: plan,
    onRefresh: () => refresh(),
  });
};
</script>
