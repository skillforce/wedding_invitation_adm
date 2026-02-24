<script setup lang="ts">
import burgerMenuIconUrl from '@/assets/burger_menu_icon.svg'

defineEmits<{
  (event: 'click'): void
}>()
</script>

<template>
  <button class="mobile-menu-btn" aria-label="Open menu" @click="$emit('click')">
    <img :src="burgerMenuIconUrl" alt="" class="mobile-menu-icon" />
  </button>
</template>

<style scoped>
.mobile-menu-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  padding: 0.4rem;
}

.mobile-menu-icon {
  width: 100%;
  height: 100%;
  filter: var(--color-icon-filter-active);
}
</style>
