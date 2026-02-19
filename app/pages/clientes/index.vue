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
        @click="navigateTo('/clientes/criar')"
      />
    </div>

    <UTable
      ref="table"
      v-model:pagination="pagination"
      v-model:global-filter="globalFilter"
      :data="clientesMock"
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
    >
      <template #expanded="{ row }">
        <UScrollArea class="max-h-80">
          <ul class="space-y-2 px-2">
            <li
              v-for="ponto in row.original.pontos"
              :key="ponto.id"
              class="flex items-center justify-between p-3 light:bg-white dark:bg-muted border border-default rounded-lg hover:border-primary/50 transition-all"
            >
              <div class="flex-1 grid grid-cols-3 gap-4">
                <div>
                  <p class="font-bold">Endereço</p>
                  <span v-if="ponto.endereco.tipoEndereco === 'URBANO'">
                    <p>
                      {{ ponto.endereco.cep }} - {{ ponto.endereco.cidade }}
                    </p>
                    <p>
                      {{ ponto.endereco.rua }}, {{ ponto.endereco.numero }} -
                      {{ ponto.endereco.bairro }}
                    </p>
                    <p>
                      {{ ponto.endereco.complemento }}
                    </p>
                  </span>
                  <span v-else="ponto.complemento">
                    <p>{{ ponto.endereco.cidadeReferencia }}</p>
                    <p>{{ ponto.endereco.nomeLocal }}</p>
                    <p>{{ ponto.endereco.complemento }}</p>
                  </span>
                </div>
                <div>
                  <p class="font-bold">Pagamento</p>
                  <p>Dia de pagamento: {{ ponto.diaVencimento }}</p>
                  <p>Último pagamento:{{ ponto.diaUltimoPagamento }}</p>
                </div>
                <div>
                  <p class="font-bold">Situação</p>
                  <UBadge
                    :label="STATUS_POINT[ponto.status]?.label"
                    :color="STATUS_POINT[ponto.status]?.color"
                    variant="subtle"
                    class="mt-1.5"
                  />
                </div>
              </div>
            </li>
          </ul>
        </UScrollArea>
      </template>
    </UTable>

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
import type { TableColumn } from "@nuxt/ui";
import type { TGetCliente } from "~/types/clients";
import { clientesMock } from "~/mocks/clientes";
import { STATUS_CLIENT } from "~/constants/enumClient";
import { STATUS_POINT } from "~/constants/enumConnectionPoint";

const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");

const table = useTemplateRef("table");

const pagination = ref({
  pageIndex: 0,
  pageSize: 5,
});

const globalFilter = ref("");

const { asyncFetch } = useApi();

const { data, status, error, refresh } = await asyncFetch<any>("/clientes", {
  key: "clients-get-all-page",
});

const emptyMessage = computed(() => {
  if (status.value === "error" && error) return getErrorMessageApi(error.value);

  return "Nenhum cliente encontrado";
});

const columns: TableColumn<TGetCliente>[] = [
  {
    id: "expand",
    cell: ({ row }) =>
      h(UButton, {
        color: "neutral",
        variant: "ghost",
        icon: "i-lucide-chevron-down",
        square: true,
        "aria-label": "Expand",
        ui: {
          leadingIcon: [
            "transition-transform",
            row.getIsExpanded() ? "duration-200 rotate-180" : "",
          ],
        },
        onClick: () => row.toggleExpanded(),
      }),
  },
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
          if (row.original.status === "DESATIVADO") return;

          const status = STATUS_POINT[ponto.status];

          return h(
            UBadge,
            {
              key: ponto.id,
              color: status?.color,
              variant: "subtle",
              title: status?.label,
            },
            () => status?.short,
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
        label: "Detalhes",
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
