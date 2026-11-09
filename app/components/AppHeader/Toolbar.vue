<template>
  <ClientOnly>
    <Teleport defer to="#header-toolbar">
      <UDashboardToolbar :ui="{ root: 'p-4!' }">
        <slot />
      </UDashboardToolbar>
    </Teleport>
  </ClientOnly>
</template>
