<template>
  <ClientOnly>
    <Teleport defer to="#header-title">
      <slot />
    </Teleport>
  </ClientOnly>
</template>
