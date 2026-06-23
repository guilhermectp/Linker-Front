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
          label="Cancelar"
          color="neutral"
          variant="outline"
          :disabled="isLoading"
          @click="close"
        />
        <UButton
          :label="config.confirmLabel"
          :icon="config.confirmIcon"
          :loading="isLoading"
          :disabled="isLoading"
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

type IItemTypes = "point";

interface ItemTypeConfig {
  title: string;
  verb: string;
  entity: string;
  confirmLabel: string;
  confirmIcon?: string;
  confirmColor: UINuxtColors;
  consequences?: string[];
}

const itemTypeConfig: Record<IItemTypes, ItemTypeConfig> = {
  point: {
    title: "Excluir ponto",
    verb: "excluir",
    entity: "o ponto",
    confirmLabel: "Excluir",
    confirmIcon: "lucide:check",
    confirmColor: "error",
    consequences: [
      "A conexão será encerrada.",
      "Não esqueça de abrir chamado para retirada dos equipamentos.",
    ],
  },
};

const props = defineProps<{
  itemType: IItemTypes;
  itemName?: string;
  isLoading?: boolean;
}>();

const config = computed(() => itemTypeConfig[props.itemType]);

const confirm = (close: () => void) => {
  emit("confirm");
  close();
};
</script>
