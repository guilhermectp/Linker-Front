<template>
  <UModal :title="config.title">
    <template #body>
      <div class="flex flex-col gap-4">
        <p>
          Tem certeza que deseja <strong>{{ config.verb }}</strong>
          {{ config.entity }} <strong>"{{ itemName }}"</strong>?
        </p>

        <ul
          v-if="config.consequences?.length"
          class="list-disc list-inside text-sm space-y-1 text-muted"
        >
          <li v-for="item in config.consequences" :key="item">{{ item }}</li>
        </ul>

        <slot name="extra" />
      </div>
    </template>

    <template #footer="{ close }">
      <div class="flex justify-end gap-3 w-full">
        <UButton
          :label="config.confirmCancel || 'Cancelar'"
          color="neutral"
          variant="outline"
          @click="close"
        />
        <UButton
          :label="config.confirmLabel || 'Excluir'"
          :icon="config.confirmIcon"
          :color="config.confirmColor"
          @click="confirm(close)"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { UINuxtColors } from "~/types/ui";

const emit = defineEmits(["confirm"]);

type IItemTypes =
  | "cancelPoint"
  // | "activePoint"
  // | "grantAccessPoint"
  | "support"
  | "plan";

interface ItemTypeConfig {
  title: string;
  verb: string;
  entity: string;
  confirmColor: UINuxtColors;
  confirmLabel?: string;
  confirmCancel?: string;
  confirmIcon?: string;
  consequences?: string[];
}

const itemTypeConfig: Record<IItemTypes, ItemTypeConfig> = {
  cancelPoint: {
    title: "Cancelar ponto",
    verb: "cancelar",
    entity: "o ponto",
    confirmLabel: "Sim, cancelar",
    confirmCancel: "Não",
    confirmColor: "error",
    consequences: [
      "O ponto continuará no histórico do cliente.",
      "O ponto poderá ser reativado posteriormente.",
      "Não se esqueça de gerar uma Ordem de Serviço para retirada dos equipamentos.",
    ],
  },
  // activePoint: {
  //   title: "Ativar ponto",
  //   verb: "ativar",
  //   entity: "o ponto",
  //   confirmLabel: "Sim, ativar",
  //   confirmCancel: "Não",
  //   confirmColor: "success",
  // },
  // grantAccessPoint: {
  //   title: "Liberar acesso",
  //   verb: "liberar",
  //   entity: "o acesso do ponto",
  //   confirmLabel: "Sim, liberar",
  //   confirmCancel: "Não",
  //   confirmColor: "warning",
  // },
  support: {
    title: "Excluir ordem de serviço",
    verb: "excluir",
    entity: "a ordem de serviço",
    confirmColor: "error",
  },
  plan: {
    title: "Excluir plano",
    verb: "excluir",
    entity: "o plano",
    confirmColor: "error",
  },
};

const props = defineProps<{
  itemType: IItemTypes;
  itemName?: string;
}>();

const config = computed(() => itemTypeConfig[props.itemType]);

const confirm = (close: () => void) => {
  emit("confirm");
  close();
};
</script>
