<template>
  <div class="space-y-8">
    <div class="flex flex-wrap justify-between items-center gap-4">
      <UInput
        v-model="nameOrUsernameFilter"
        placeholder="Buscar por nome do cliente ou usuário microtik"
        class="flex-1 min-w-72"
        size="lg"
      />
      <USelect
        v-model="statusFilter"
        :items="statusItems"
        placeholder="Filtrar por tipo de cadastro"
        class="flex-1 min-w-72"
        size="lg"
      />
      <USelect
        v-model="addressFilter"
        :items="addressItems"
        placeholder="Filtrar por tipo de endereço"
        class="flex-1 min-w-72"
        size="lg"
      />
      <UFieldGroup size="lg" class="">
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
        @click="navigateTo('/clientes/criar')"
        class="w-fit"
        size="lg"
      />
    </div>

    <template v-if="currentView === 'table'">
      <UITable
        :loading="status === 'pending'"
        :data="data"
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
      <ClientListCards
        :loading="status === 'pending'"
        :data="data"
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
import type { SelectItem, TableColumn } from "@nuxt/ui";
import type { TGetCliente } from "~/types/clients";
import { STATUS_CLIENT } from "~/constants/enumClient";
import { STATUS_POINT } from "~/constants/enumConnectionPoint";

const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");

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

const currentView = ref<"cards" | "table">("table");

const page = ref<number>(0);
const itemsPerPage = ref<number>(10);
const totalElements = ref<number>(100);

const { data, status, error, refresh } = await useAsyncApi<any>(
  "clients-fetch-all-page",
  "/clientes",
);

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
          variant: "soft",
          class: "px-4 rounded-full",
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
              variant: "soft",
              class: "px-4 rounded-full",
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
        variant: "ghost",
        "aria-label": "Actions dropdown",
        onClick: () => navigateTo(`/clientes/${row.original.id}`),
      });
    },
  },
];
</script>
