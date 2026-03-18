<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import arrowIconUrl from '@/assets/arrow.svg'

defineProps<{ collapsed: boolean }>()
defineEmits<{ toggle: [] }>()

const { t } = useI18n()
</script>

<template>
  <button
    class="collapse-btn"
    :aria-label="t('a11y.sidebarToggle')"
    @click="$emit('toggle')"
  >
    <img
      :src="arrowIconUrl"
      :class="['collapse-icon', { collapsed }]"
      :alt="t('a11y.sidebarToggle')"
    />
  </button>
</template>

<style scoped>
.collapse-btn {
  position: absolute;
  top:-5px;
  right: -5px;
  z-index: 10;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background: var(--color-sidebar-bg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.25);
  transition: background 0.2s ease, box-shadow 0.2s ease;
}

.collapse-btn:hover {
  background: var(--color-hover);
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.35);
}

.collapse-icon {
  width: 14px;
  height: 14px;
  filter: var(--color-icon-filter);
  transform: rotate(-90deg);
  transition: transform 0.2s ease;
  opacity: 0.7;
}

.collapse-btn:hover .collapse-icon {
  filter: var(--color-icon-filter-active);
  opacity: 1;
}

.collapse-icon.collapsed {
  transform: rotate(90deg);
}
</style>
