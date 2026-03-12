<template>
  <UCard variant="subtle">
    <template #header>
      <div class="flex justify-between items-center gap-4">
        <h3 class="font-semibold text-highlighted">
          Boletos
          <span
            class="ml-2 text-xs font-normal text-muted bg-muted px-2 py-1.5 rounded-full"
          >
            {{ mockBoletos.length }}
          </span>
        </h3>
        <UButton
          icon="lucide:plus"
          variant="ghost"
          label="Gerar Boleto"
          @click=""
        />
      </div>
    </template>

    <ul
      class="space-y-4 max-h-110 lg:max-h-full overflow-y-auto lg:overflow-hidden pr-5 lg:pr-0"
    >
      <li
        v-for="boleto in mockBoletos"
        :key="boleto.id"
        class="group border border-default rounded-lg p-4 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-4">
            <div
              class="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
              :class="statusConfig[boleto.situacao].bg"
            >
              <UIcon
                :name="statusConfig[boleto.situacao].icon"
                class="w-4 h-4"
                :class="statusConfig[boleto.situacao].iconColor"
              />
            </div>

            <div class="flex-1 space-y-2">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold">
                  {{ boleto.referente }}
                </span>
                <UBadge
                  variant="subtle"
                  :color="statusConfig[boleto.situacao].color"
                  :label="ENUM_STATUS_BOLETO[boleto.situacao]"
                />
              </div>

              <div class="flex items-center gap-4 text-sm text-muted flex-wrap">
                <span class="flex items-center gap-1">
                  <UIcon name="lucide:circle-dollar-sign" class="w-3.5 h-3.5" />
                  <span class="font-medium text-highlighted">{{
                    formatCurrency(boleto.valor)
                  }}</span>
                </span>

                <span class="flex items-center gap-1">
                  <UIcon name="lucide:calendar-x" class="w-3.5 h-3.5" />
                  Vence em {{ boleto.dataVencimento }}
                </span>

                <span
                  v-if="boleto.dataPagamento"
                  class="flex items-center gap-1 text-success"
                >
                  <UIcon name="lucide:calendar-check" class="w-3.5 h-3.5" />
                  Pago em {{ boleto.dataPagamento }}
                </span>
              </div>

              <div class="text-sm text-muted line-clamp-2">
                {{ boleto.observacao }}
              </div>
            </div>
          </div>

          <div
            class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <UButton variant="ghost" icon="lucide:printer" />
            <UButton variant="ghost" icon="lucide:pencil" />
            <UButton variant="ghost" color="error" icon="lucide:trash-2" />
          </div>
        </div>
      </li>
    </ul>
  </UCard>
</template>

<script setup lang="ts">
type TBoleto = {
  id: string;
  referente: string;
  valor: number;
  dataVencimento: string;
  situacao: "PENDENTE" | "PAGO" | "VENCIDO" | "CANCELADO";
  dataPagamento?: string;
  observacao?: string;
};

const ENUM_STATUS_BOLETO = {
  PENDENTE: "Pendente",
  PAGO: "Pago",
  VENCIDO: "Vencido",
  CANCELADO: "Cancelado",
};

const statusConfig = {
  PENDENTE: {
    bg: "bg-warning/10",
    icon: "i-lucide-clock",
    iconColor: "text-warning",
    color: "warning" as const,
  },
  PAGO: {
    bg: "bg-success/10",
    icon: "i-lucide-check-circle",
    iconColor: "text-success",
    color: "success" as const,
  },
  VENCIDO: {
    bg: "bg-error/10",
    icon: "i-lucide-alert-circle",
    iconColor: "text-error",
    color: "error" as const,
  },
  CANCELADO: {
    bg: "bg-neutral/10",
    icon: "i-lucide-ban",
    iconColor: "text-muted",
    color: "neutral" as const,
  },
};

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const mockBoletos: TBoleto[] = [
  {
    id: "BOL-003",
    referente: "Março/2026",
    valor: 119.9,
    dataVencimento: "15/03/2026",
    situacao: "PENDENTE",
  },
  {
    id: "BOL-002",
    referente: "Fevereiro/2026",
    valor: 109.9,
    dataVencimento: "15/02/2026",
    situacao: "VENCIDO",
  },
  {
    id: "BOL-001",
    referente: "Janeiro/2026",
    valor: 109.9,
    dataVencimento: "15/01/2026",
    situacao: "PAGO",
    dataPagamento: "13/01/2026",
    observacao: "adicionado sei la o que",
  },
  {
    id: "BOL-004",
    referente: "Dezembro/2025",
    valor: 109.9,
    dataVencimento: "15/12/2025",
    situacao: "PAGO",
    dataPagamento: "14/12/2025",
  },
  {
    id: "BOL-005",
    referente: "Novembro/2025",
    valor: 109.9,
    dataVencimento: "15/11/2025",
    situacao: "CANCELADO",
    observacao: "abatido em 1 frango",
  },
];
</script>
