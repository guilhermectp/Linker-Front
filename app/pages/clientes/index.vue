<template>
  <div class="space-y-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <UInput
        v-model="nameOrUsernameFilter"
        placeholder="Buscar por nome do cliente ou usuário microtik"
        class="flex-1 lg:col-span-2"
        size="lg"
      />
      <USelect
        v-model="statusFilter"
        :items="statusItems"
        placeholder="Filtrar por tipo de cadastro"
        class="flex-1"
        size="lg"
      />
      <USelect
        v-model="addressFilter"
        :items="addressItems"
        placeholder="Filtrar por tipo de endereço"
        class="flex-1"
        size="lg"
      />

      <div class="flex justify-end">
        <UButton
          label="Novo"
          icon="i-lucide:plus"
          @click="navigateTo('/clientes/criar')"
          class="w-fit"
          size="lg"
        />
      </div>
    </div>

    <UTable
      ref="table"
      v-model:pagination="pagination"
      v-model:global-filter="nameOrUsernameFilter"
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
import { getPaginationRowModel } from "@tanstack/vue-table";
import type { SelectItem, TableColumn } from "@nuxt/ui";
import type { TGetCliente } from "~/types/clients";
import { STATUS_CLIENT } from "~/constants/enumClient";
import { STATUS_POINT } from "~/constants/enumConnectionPoint";

const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const { asyncFetch } = useApi();

const statusItems = ref<SelectItem[]>([
  {
    label: "Ativo",
    value: "ATIVO",
  },
  {
    label: "Desativado",
    value: "DESATIVADO",
  },
]);

const addressItems = ref<SelectItem[]>([
  {
    label: "Urbano",
    value: "URBANO",
  },
  {
    label: "Rural",
    value: "RURAL",
  },
]);

const nameOrUsernameFilter = ref("");
const statusFilter = ref("");
const addressFilter = ref("");

const { data, status, error, refresh } = await asyncFetch<any>(
  "clients-fetch-all-page",
  "/clientes",
);

const emptyMessage = computed(() => {
  if (status.value === "error" && error) return getErrorMessage(error.value);
});

const table = useTemplateRef("table");

const pagination = ref({
  pageIndex: 0,
  pageSize: 5,
});

const columns: TableColumn<TGetCliente>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "telefone",
    header: "Telefone",
  },
  {
    accessorKey: "status",
    header: "Cadastro",
    cell: ({ row }) => {
      const status = STATUS_CLIENT[row.original.status];

      return h(
        UBadge,

        {
          color: status?.color,
          variant: "subtle",
          title: status?.label,
        },
        () => status?.label,
      );
    },
  },
  {
    accessorKey: "status",
    header: "Situação",
    cell: ({ row }) => {
      const pontos = row.original.pontos || [];

      return h(
        "div",
        { class: "flex gap-1" },
        pontos.map((ponto) => {
          if (row.original.status === "SUSPENSO") return;

          const status = STATUS_POINT[ponto.status];

          return h(
            UBadge,
            {
              key: ponto.id,
              color: status?.color,
              variant: "subtle",
              title: status?.label,
            },
            () => status?.label,
          );
        }),
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
      return h(UButton, {
        label: "",
        "trailing-icon": "lucide:arrow-right",
        color: "info",
        variant: "ghost",
        "aria-label": "Actions dropdown",
        onClick: () => navigateTo(`/clientes/${row.original.id}`),
      });
    },
  },
];
</script>
