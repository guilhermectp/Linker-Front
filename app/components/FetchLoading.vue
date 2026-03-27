<template>
  <div
    class="flex flex-col items-center justify-center py-24 gap-4 text-center"
  >
    <UIcon
      name="lucide:loader-circle"
      class="size-10 text-muted animate-spin"
    />
    <p class="text-sm text-muted">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  message: { type: String, default: "Carregando..." },
});
</script>
