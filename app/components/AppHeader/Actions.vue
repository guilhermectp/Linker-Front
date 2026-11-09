<template>
  <ClientOnly>
    <Teleport defer to="#header-actions">
      <slot />
    </Teleport>
    <Teleport defer to="#header-actions-mobile">
      <slot />
    </Teleport>
  </ClientOnly>
</template>
