<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <UInput
        v-model="globalFilter"
        placeholder="Buscar por nome, descrição ou valor"
        class="w-1/4"
        size="lg"
      />
      <UButton
        label="Novo"
        icon="i-lucide:plus"
        @click="openFormModalToCreate"
      />
    </div>

    <UTable
      ref="table"
      v-model:pagination="pagination"
      v-model:global-filter="globalFilter"
      :data="data"
      :loading="status === 'pending'"
      :columns="columns"
      :empty="emptyMessage"
      :pagination-options="{
        getPaginationRowModel: getPaginationRowModel(),
      }"
      class="flex-1"
      :ui="{
        root: 'shadow-sm border border-accented rounded',
        tr: 'hover:light:bg-elevated hover:dark:bg-elevated/50 transition-all',
      }"
    />

    <div class="flex justify-center pt-4 px-4">
      <UPagination
        :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length"
        @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPaginationRowModel, type Row } from "@tanstack/vue-table";
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

const table = useTemplateRef("table");

const pagination = ref({
  pageIndex: 0,
  pageSize: 5,
});

const globalFilter = ref("");

const { asyncFetch } = useApi();

const { data, status, error, refresh } = await asyncFetch<any>(
  `plans-fetch-all-page`,
  "/planos",
);

const emptyMessage = computed(() => {
  if (status.value === "error" && error) return getErrorMessageApi(error.value);

  return "Nenhum plano encontrado";
});

const columns: TableColumn<TPlan>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "descricao",
    header: "Descrição",
  },
  {
    accessorKey: "uploadMB",
    header: "Upload (MB)",
  },
  {
    accessorKey: "downloadMB",
    header: "Download (MB)",
  },
  {
    accessorKey: "valor",
    header: "Valor",
    meta: {
      class: {
        th: "text-right",
        td: "text-right font-medium",
      },
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("valor"));
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);
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
      label: "Copiar Plano",
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
      label: "Editar Plano",
      onSelect() {
        openFormModalToEdit(row.original);
      },
    },
    {
      label: "Deletar Plano",
      onSelect() {
        openDeleteModal(row.original);
      },
    },
  ];
};

const openFormModalToCreate = () => {
  const modal = overlay.create(PlanFormModal);
  modal.open();
};

const openFormModalToEdit = (plan?: TPlan) => {
  const modal = overlay.create(PlanFormModal, {
    props: { plan },
  });
  modal.open();
};

const openDeleteModal = (plan: TPlan) => {
  const modal = overlay.create(PlanDeleteModal, {
    props: { plan },
  });
  modal.open();
};
</script>
