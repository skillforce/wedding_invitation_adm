<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import arrowIconUrl from '@/assets/arrow.svg'

defineProps<{
  collapsed: boolean
}>()

defineEmits<{
  (event: 'toggle'): void
}>()

const { t } = useI18n()
</script>

<template>
  <button
    class="sidebar-toggle"
    :aria-label="t('a11y.sidebarToggle')"
    @click="$emit('toggle')"
  >
    <img
      :src="arrowIconUrl"
      :class="['sidebar-toggle-icon', { collapsed }]"
      :alt="t('a11y.sidebarToggle')"
    />
  </button>
</template>

<style scoped>
.sidebar-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  transition: background 0.2s ease;
}

.sidebar-toggle:hover {
  background: var(--color-hover);
}

.sidebar-toggle-icon {
  width: 30px;
  height: 30px;
  filter: var(--color-icon-filter);
  transform: rotate(-90deg);
  transition: transform 0.2s ease;
  opacity: 0.6;
}

.sidebar-toggle:hover .sidebar-toggle-icon {
  filter: var(--color-icon-filter-active);
  opacity: 1;
}

.sidebar-toggle-icon.collapsed {
  transform: rotate(90deg);
}
</style>
