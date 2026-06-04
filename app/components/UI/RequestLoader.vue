<template>
  <template v-if="typeLoading === 'modal'">
    <UModal :dismissible="false">
      <template #content>
        <div class="w-full h-full p-8">
          <div
            class="h-full text-muted flex flex-col items-center justify-center gap-2"
          >
            <div class="loader-one" :style="loaderStyles"></div>
            {{ props.message }}
          </div>
        </div>
      </template>
    </UModal>
  </template>
  <template v-else>
    <div class="w-full h-full">
      <div class="h-full text-muted flex items-center justify-center gap-2">
        <div class="loader-one" :style="loaderStyles"></div>
        <span class="">
          {{ props.message }}
        </span>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
const props = defineProps({
  message: {
    type: String,
    default: "Carregando...",
  },
  size: {
    type: Number,
    default: 40,
    validator: (value: number) => value > 0,
  },
  typeLoading: {
    type: String as PropType<"default" | "modal">,
    default: "default",
  },
});

const loaderStyles = computed(() => ({
  width: `${props.size}px`,
  padding: `${props.size * 0.16}px`,
}));
</script>

<style scoped>
.loader-one {
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--color-primary-500);
  --_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
  mask: var(--_m);
  -webkit-mask-composite: source-out;
  mask-composite: subtract;
  animation: l3 1s infinite linear;
}

@keyframes l3 {
  to {
    transform: rotate(1turn);
  }
}
</style>
