<template>
  <UCard variant="subtle">
    <template #header>
      <div class="flex justify-between items-center gap-4">
        <h3 class="font-semibold">
          Ordens de Serviço
          <span
            class="ml-2 text-sm font-normal text-muted bg-muted px-2 py-1.5 rounded-full"
          >
            {{ mockServiceOrders.length }}
          </span>
        </h3>

        <UButton
          icon="lucide:plus"
          variant="ghost"
          label="Nova Ordem de Serviço"
          @click=""
        />
      </div>
    </template>

    <ul
      class="space-y-4 max-h-110 lg:max-h-full overflow-y-auto lg:overflow-hidden pr-5 lg:pr-0"
    >
      <li
        v-for="order in mockServiceOrders"
        :key="order.id"
        class="group border border-default rounded-lg p-4 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer"
      >
        <div class="flex items-start justify-between gap-4 min-w-0">
          <div class="flex items-start gap-3 min-w-0 flex-1">
            <div
              class="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mt-0.5"
              :class="typeConfig[order.tipo].bg"
            >
              <UIcon
                :name="typeConfig[order.tipo].icon"
                class="w-4 h-4"
                :class="typeConfig[order.tipo].iconColor"
              />
            </div>

            <div class="space-y-3">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold">
                  {{ ENUM_TYPE_SERVICE[order.tipo] }}
                </span>
                <UBadge
                  variant="subtle"
                  :color="statusConfig[order.situacao].color"
                  :label="ENUM_STATUS_SERVICE[order.situacao]"
                />
              </div>

              <div class="flex items-center gap-4 text-sm text-muted flex-wrap">
                <span class="flex items-center gap-1">
                  <UIcon name="lucide:calendar-plus" class="w-3.5 h-3.5" />
                  Aberta em {{ order.dataAbertura }}
                </span>
                <span class="flex items-center gap-1">
                  <UIcon name="lucide:calendar-clock" class="w-3.5 h-3.5" />
                  Agendada para {{ order.dataAgendada }}
                </span>
              </div>

              <p
                v-if="order.observacao"
                class="text-sm text-muted text-justify line-clamp-2"
              >
                {{ order.observacao }}
              </p>
            </div>
          </div>

          <div
            class="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <UButton variant="ghost" icon="lucide:pencil" />
            <UButton variant="ghost" color="error" icon="lucide:trash-2" />
          </div>
        </div>
      </li>
    </ul>
  </UCard>
</template>

<script setup lang="ts">
type TServiceOrder = {
  id?: string;
  tipo: "INSTALACAO" | "SUPORTE" | "CANCELAMENTO" | "TROCA_ENDERECO";
  dataAbertura: string;
  dataAgendada: string;
  situacao: "EM_ANDAMENTO" | "FINALIZADA" | "CANCELADA";
  observacao: string;
};

const ENUM_TYPE_SERVICE = {
  INSTALACAO: "Instalação",
  SUPORTE: "Suporte",
  CANCELAMENTO: "Retirada",
  TROCA_ENDERECO: "Troca de Residência",
};

const ENUM_STATUS_SERVICE = {
  EM_ANDAMENTO: "Pendente",
  FINALIZADA: "Finalizada",
  CANCELADA: "Cancelada",
};

const typeConfig = {
  INSTALACAO: {
    bg: "bg-info/10",
    icon: "i-lucide-wifi",
    iconColor: "text-info",
  },
  SUPORTE: {
    bg: "bg-primary/10",
    icon: "i-lucide-wrench",
    iconColor: "text-primary",
  },
  CANCELAMENTO: {
    bg: "bg-warning/10",
    icon: "i-lucide-package-minus",
    iconColor: "text-warning",
  },
  TROCA_ENDERECO: {
    bg: "bg-success/10",
    icon: "i-lucide-map-pin",
    iconColor: "text-success",
  },
};

const statusConfig = {
  EM_ANDAMENTO: { color: "warning" as const },
  FINALIZADA: { color: "success" as const },
  CANCELADA: { color: "error" as const },
};

const mockServiceOrders: TServiceOrder[] = [
  {
    id: "OS-005",
    tipo: "CANCELAMENTO",
    dataAbertura: "11/03/2026",
    dataAgendada: "18/03/2026",
    situacao: "EM_ANDAMENTO",
    observacao: "Cliente solicitou cancelamento do contrato.",
  },
  {
    id: "OS-004",
    tipo: "SUPORTE",
    dataAbertura: "10/03/2026",
    dataAgendada: "11/03/2026",
    situacao: "CANCELADA",
    observacao: "",
  },
  {
    id: "OS-003",
    tipo: "TROCA_ENDERECO",
    dataAbertura: "08/03/2026",
    dataAgendada: "12/03/2026",
    situacao: "FINALIZADA",
    observacao:
      "Mudança para Rua das Flores, 42. Verificar viabilidade técnica.",
  },
  {
    id: "OS-002",
    tipo: "SUPORTE",
    dataAbertura: "05/03/2026",
    dataAgendada: "07/03/2026",
    situacao: "FINALIZADA",
    observacao: "Lentidão relatada pelo cliente. Reconfigurado roteador.",
  },

  {
    id: "OS-001",
    tipo: "INSTALACAO",
    dataAbertura: "01/03/2026",
    dataAgendada: "05/03/2026",
    situacao: "FINALIZADA",
    observacao:
      "Instalação de fibra óptica 300MB. Cliente confirmou recebimento.",
  },
];
</script>
