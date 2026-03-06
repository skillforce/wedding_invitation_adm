<template>
  <Transition name="collapse">
    <div v-if="show" class="collapse-grid">
      <div class="collapse-inner">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{ show: boolean }>()
</script>

<style scoped>
.collapse-grid {
  display: grid;
  grid-template-rows: 1fr;
}

.collapse-inner {
  overflow: hidden;
}

.collapse-enter-active,
.collapse-leave-active {
  transition:
    grid-template-rows 0.36s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.3s ease;
}

.collapse-enter-from,
.collapse-leave-to {
  grid-template-rows: 0fr;
  opacity: 0;
}
</style>
