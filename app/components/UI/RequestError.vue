<template>
  <div
    class="flex flex-col items-center justify-center text-center h-full min-h-100"
  >
    <div class="relative mb-4">
      <div
        class="absolute inset-0 rounded-full blur-xl animate-pulse"
        :class="iconBgClass"
      />

      <div class="relative p-4 rounded-full" :class="iconContainerClass">
        <UIcon
          :name="friendly.icon"
          class="size-12"
          :class="[iconColorClass]"
        />
      </div>
    </div>

    <h3 class="font-bold text-2xl mb-2" :class="titleClass">
      {{ friendly.title }}
    </h3>

    <p class="text-default-500 text-base max-w-md mb-6">
      {{ friendly.description }}
    </p>

    <UCard
      v-if="$slots.details"
      class="max-w-sm w-full mb-6 text-left"
      :class="cardClass"
    >
      <slot name="details"></slot>
    </UCard>

    <div class="flex gap-3 flex-wrap justify-center">
      <UButton
        v-if="friendly.showRetry"
        color="neutral"
        variant="soft"
        icon="lucide:refresh-cw"
        label="Tentar novamente"
        @click="emit('retry')"
      />

      <UButton
        v-if="friendly.customAction"
        :color="friendly.color"
        variant="soft"
        :icon="friendly.customAction.icon"
        :label="friendly.customAction.label"
        @click="emit(friendly.customAction.event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FriendlyErrorOptions } from "~/types/errorHandler";

interface Props {
  error: any;
  options?: FriendlyErrorOptions;
}

const props = defineProps<Props>();

const emit = defineEmits(["retry", "contactSupport"]);

const friendly = computed(() => {
  return getFriendlyError(props.error, props.options);
});

const colorMap = {
  warning: {
    iconBg: "bg-warning/10",
    iconContainer: "bg-warning/10",
    iconColor: "text-warning",
    title: "text-warning",
    card: "border-warning/20 bg-warning/5",
    detailIcon: "text-warning",
  },
  error: {
    iconBg: "bg-error/10",
    iconContainer: "bg-error/10",
    iconColor: "text-error",
    title: "text-error",
    card: "border-error/20 bg-error/5",
    detailIcon: "text-error",
  },
  neutral: {
    iconBg: "bg-neutral/10",
    iconContainer: "bg-neutral/10",
    iconColor: "text-neutral",
    title: "text-default",
    card: "border-default-200 bg-default-50",
    detailIcon: "text-default-400",
  },
};

const colors = computed(() => {
  return colorMap[friendly.value.color] || colorMap.neutral;
});

const iconBgClass = computed(() => colors.value.iconBg);
const iconContainerClass = computed(() => colors.value.iconContainer);
const iconColorClass = computed(() => colors.value.iconColor);
const titleClass = computed(() => colors.value.title);
const cardClass = computed(() => colors.value.card);
</script>
