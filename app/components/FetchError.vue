<template>
  <div
    class="flex flex-col items-center justify-center py-24 gap-4 text-center"
  >
    <UIcon name="lucide:info" class="w-12 h-12 text-muted" />
    <p class="text-lg font-semibold">{{ message }}</p>
    <UButton
      variant="outline"
      label="Tentar novamente"
      @click="$emit('retry')"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{ message?: string }>();

defineEmits<{ retry: [] }>();
</script>
