<template>
  <div class="space-y-8">
    <div class="flex flex-wrap justify-between items-center gap-4">
      <UInput
        v-model="nameOrUsernameFilter"
        placeholder="Buscar por nome do cliente ou usuário microtik"
        class="flex-1 min-w-72"
        size="lg"
      />

      <USelectMenu
        v-model="statusFilter"
        :items="statusItems"
        placeholder="Filtrar por situação"
        class="flex-1 min-w-72"
        size="lg"
        label-key="label"
        value-key="value"
        :search-input="false"
        clear
      />

      <USelectMenu
        v-model="addressFilter"
        :items="addressItems"
        placeholder="Filtrar por tipo de endereço"
        class="flex-1 min-w-72"
        size="lg"
        label-key="label"
        value-key="value"
        :search-input="false"
        clear
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
        :data="data?.data || []"
        :error="error"
        :columns="columns"
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
        :total-elements="totalElements"
        @retry="refresh"
      >
        <template #status-cell="{ row }">
          <div v-if="row.original.pontos.length" class="flex gap-1">
            <UBadge
              v-for="ponto in row.original.pontos"
              :key="ponto.id"
              variant="soft"
              :label="STATUS_POINT[(ponto as TGetPontoConexao).status].label"
              :color="STATUS_POINT[(ponto as TGetPontoConexao).status].color"
              class="rounded-full px-4"
            />
          </div>

          <div v-else>-</div>
        </template>
      </UITable>
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
        <template #card-content="{ item }">
          <div class="flex items-center justify-between mb-2">
            <h1 class="font-bold text-lg text-highlighted">
              {{ item.nome }}
            </h1>

            <UButton
              class="rounded-md"
              trailing-icon="lucide:arrow-right"
              color="info"
              variant="ghost"
              aria-label="Actions dropdown"
              @click="navigateTo(`/clientes/${item.id}`)"
            />
          </div>

          <dl class="flex flex-col gap-3">
            <div class="flex gap-2 text-sm">
              <dt class="text-muted min-w-18 shrink-0">Email:</dt>
              <dd class="text-default font-medium">{{ item.email }}</dd>
            </div>
            <div class="flex gap-2 text-sm">
              <dt class="text-muted min-w-18 shrink-0">Telefone:</dt>
              <dd class="text-default font-medium">{{ item.telefone }}</dd>
            </div>
            <div class="flex gap-2 text-[13px]">
              <dt class="text-muted min-w-18 shrink-0">Pontos:</dt>
              <dd
                class="text-default font-medium break-all flex gap-1 flex-wrap"
              >
                <UBadge
                  v-for="ponto in item.pontos"
                  :key="ponto.id"
                  variant="soft"
                  :label="STATUS_POINT[ponto.status].label"
                  :color="STATUS_POINT[ponto.status].color"
                  class="rounded-full px-4"
                />
              </dd>
            </div>
          </dl>
        </template>
      </UICard>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { SelectItem, TableColumn } from "@nuxt/ui";
import type { Cliente, FetchClientes } from "~/types/clients";
import {
  ENUM_STATUS_POINT,
  STATUS_POINT,
} from "~/constants/enumConnectionPoint";
import type { TGetPontoConexao } from "~/types/connectionPoint";

definePageMeta({
  title: "Clientes",
});

const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");

// Filtro de acordo com pontos - arrumar no back
const statusItems = ref<SelectItem[]>([
  {
    label: "Ativo",
    value: ENUM_STATUS_POINT.ATIVO,
  },
  {
    label: "Reduzido",
    value: ENUM_STATUS_POINT.REDUZIDO,
  },
  {
    label: "Bloqueado",
    value: ENUM_STATUS_POINT.BLOQUEADO,
  },
  {
    label: "Cancelado",
    value: ENUM_STATUS_POINT.CANCELADO,
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
const nameOrUsernameFilterDebounced = useDebounce(nameOrUsernameFilter, 600);

const statusFilter = ref<string>("");
const addressFilter = ref<string>("");

const currentView = ref<"cards" | "table">("table");

const page = ref<number>(1);
const itemsPerPage = ref<number>(10);
const totalElements = ref<number>(0);

const { data, status, error, refresh } = await useAsyncApi<FetchClientes>(
  "fetch-clients",
  "/clientes",
  {
    query: {
      pagina: page.value,
      itemsPorPagina: itemsPerPage.value,
      busca: () => nameOrUsernameFilterDebounced.value || undefined,
      situacao: () => statusFilter.value || undefined,
      tipoEndereco: () => addressFilter.value || undefined,
    },
    watch: [
      page,
      itemsPerPage,
      nameOrUsernameFilterDebounced,
      statusFilter,
      addressFilter,
    ],
  },
);

watch(
  [nameOrUsernameFilterDebounced, statusFilter, addressFilter, itemsPerPage],
  () => {
    page.value = 0;
  },
  { flush: "sync" },
);

watch(data, (newValue) => {
  if (newValue) totalElements.value = newValue.total;
});

const columns: TableColumn<Cliente>[] = [
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
    header: "Situação",
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
