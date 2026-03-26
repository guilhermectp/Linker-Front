<template>
  <UApp :locale="pt_br">
    <UHeader mode="slideover" class="bg-white dark:bg-default">
      <template #left>
        <NuxtLink to="/"> Linker </NuxtLink>
      </template>

      <UNavigationMenu
        :items="items"
        class="w-full justify-center"
        variant="link"
      />

      <template #right>
        <UColorModeButton />

        <UButton
          to="https://github.com/nuxt-ui-templates/starter"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>

      <template #body>
        <UNavigationMenu
          :items="items"
          class="w-full justify-center"
          orientation="vertical"
        />
      </template>
    </UHeader>

    <UMain>
      <UContainer class="p-4 lg:p-8">
        <NuxtPage />
      </UContainer>
    </UMain>
    <!--
    <USeparator icon="i-simple-icons-nuxtdotjs" />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Built with Nuxt UI • © {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <UButton
          to="https://github.com/nuxt-ui-templates/starter"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter> -->
  </UApp>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { pt_br } from "@nuxt/ui/runtime/locale/index.js";

useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "pt_Br",
  },
});

const title = "Linker";
const description =
  "Um sistema baseado no MK-Auth atuando de forma mais simples performática.";

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: "https://ui.nuxt.com/assets/templates/nuxt/starter-light.png",
  twitterImage: "https://ui.nuxt.com/assets/templates/nuxt/starter-light.png",
  twitterCard: "summary_large_image",
});

const items = ref<NavigationMenuItem[]>([
  {
    label: "Clientes",
    // icon: "lucide:users",
    to: "/clientes",
  },
  {
    label: "Suporte",
    // icon: "lucide:clipboard-list",
    to: "/",
  },
  {
    label: "Planos",
    // icon: "lucide:tags",
    to: "/planos",
  },
  {
    label: "Financeiro",
    // icon: "lucide:dollar-sign",
    to: "/",
  },
  {
    label: "Sistema",
    // icon: "lucide:settings-2",
    to: "/",
  },
]);
</script>
