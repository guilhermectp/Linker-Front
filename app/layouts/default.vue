<template>
  <div class="flex flex-1">
    <USidebar
      v-if="showNavigation"
      v-model:open="open"
      mode="modal"
      collapsible="icon"
    >
      <template #header>
        <UIcon name="i-logos-nuxt-icon" class="size-8" />
      </template>

      <template #default="{ state }">
        <UNavigationMenu
          :items="items"
          orientation="vertical"
          popover
          tooltip
          :ui="{ link: 'p-1.5 overflow-hidden' }"
        />
      </template>

      <template #footer>
        <UDropdownMenu
          :items="userItems"
          :content="{ align: 'center', collisionPadding: 12 }"
          :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width) min-w-48' }"
        >
          <UButton
            v-bind="user"
            :label="user?.name"
            trailing-icon="i-lucide-chevrons-up-down"
            color="neutral"
            variant="ghost"
            square
            class="w-full data-[state=open]:bg-elevated overflow-hidden"
            :ui="{
              trailingIcon: 'text-dimmed ms-auto',
            }"
          />
        </UDropdownMenu>
      </template>
    </USidebar>

    <div class="flex-1 flex flex-col min-w-0">
      <UHeader
        toggle-side="left"
        :ui="{ container: 'px-4! max-w-full', content: 'max-w-480 bg-primary' }"
      >
        <template #toggle>
          <UTooltip text="Abrir/fechar menu lateral">
            <UButton
              icon="i-lucide-panel-left"
              color="neutral"
              variant="ghost"
              aria-label="Abrir/fechar menu lateral"
              @click="
                () => {
                  open = !open;
                }
              "
            />
          </UTooltip>
        </template>

        <template #left>
          <div id="header-title" class="peer" />
          <h1 class="hidden peer-empty:block font-semibold truncate">
            {{ title }}
          </h1>
        </template>

        <template #right>
          <div
            id="header-actions"
            class="hidden md:flex ms-auto items-center gap-2"
          />
        </template>
      </UHeader>

      <div class="flex-1 min-w-0">
        <template v-if="showNavigation">
          <div
            id="header-actions-mobile"
            class="md:hidden flex justify-end items-center gap-2 pt-4 px-4"
          />

          <div id="header-toolbar" />
        </template>

        <div class="p-6 min-w-0">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  DropdownMenuItem,
  NavigationMenuItem,
  SidebarProps,
} from "@nuxt/ui";

const route = useRoute();

defineProps<Pick<SidebarProps, "variant" | "collapsible" | "side">>();

const open = ref(true);

const title = computed(() => (route.meta.title as string | undefined) ?? "");

const showNavigation = computed(
  () =>
    !["/login", "/login/recuperar-senha", "/unauthorized"].includes(route.path),
);

const items: NavigationMenuItem[] = [
  {
    label: "Início",
    icon: "i-lucide-house",
    to: "/",
  },
  {
    label: "Clientes",
    icon: "lucide:users",
    to: "/clientes",
  },
  {
    label: "Suporte",
    icon: "lucide:clipboard-list",
    to: "/suporte",
  },
  {
    label: "Planos",
    icon: "lucide:tags",
    to: "/planos",
  },
  // {
  //   label: "Boletos",
  //   icon: "lucide:file",
  //   to: "/boletos",
  // },
  // {
  //   label: "Financeiro",
  //   icon: "lucide:dollar-sign",
  //   to: "/",
  // },
  // {
  //   label: "Sistema",
  //   icon: "lucide:settings-2",
  //   to: "/",
  // },
];

const user = ref({
  name: "Benjamin Canac",
  avatar: {
    src: "https://github.com/benjamincanac.png",
    alt: "Benjamin Canac",
  },
});

const colorMode = useColorMode();

const userItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: "Profile",
      icon: "i-lucide-user",
    },
    {
      label: "Billing",
      icon: "i-lucide-credit-card",
    },
    {
      label: "Settings",
      icon: "i-lucide-settings",
      to: "/settings",
    },
  ],
  [
    {
      label: "Appearance",
      icon: "i-lucide-sun-moon",
      children: [
        {
          label: "Light",
          icon: "i-lucide-sun",
          type: "checkbox",
          checked: colorMode.value === "light",
          onUpdateChecked(checked: boolean) {
            if (checked) {
              colorMode.preference = "light";
            }
          },
          onSelect(e: Event) {
            e.preventDefault();
          },
        },
        {
          label: "Dark",
          icon: "i-lucide-moon",
          type: "checkbox",
          checked: colorMode.value === "dark",
          onUpdateChecked(checked: boolean) {
            if (checked) {
              colorMode.preference = "dark";
            }
          },
          onSelect(e: Event) {
            e.preventDefault();
          },
        },
      ],
    },
  ],
  [
    {
      label: "GitHub",
      icon: "i-simple-icons-github",
      to: "https://github.com/nuxt/ui",
      target: "_blank",
    },
    {
      label: "Log out",
      icon: "i-lucide-log-out",
    },
  ],
]);
</script>
