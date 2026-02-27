<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  iconUrl: string
  label: string
  iconAlt?: string
  active?: boolean
  collapsed?: boolean
}>()

defineEmits<{
  click: []
}>()

const { t } = useI18n()
</script>

<template>
  <button
    class="nav-btn"
    :class="{ active, collapsed }"
    @click="$emit('click')"
  >
    <img :src="iconUrl" class="nav-icon" :alt="iconAlt ?? t('a11y.menuOptionIcon')" />
    <span v-if="!collapsed" class="nav-label">{{ label }}</span>
  </button>
</template>

<style scoped>
.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background 0.2s ease;
}

.nav-btn:hover {
  background: var(--color-hover);
}

.nav-btn.active {
  background: var(--color-active);
}

.nav-btn.collapsed {
  justify-content: center;
  padding: 0.5rem;
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  filter: var(--color-icon-filter);
  transition: filter 0.2s ease;
}

.nav-btn.active .nav-icon,
.nav-btn:hover .nav-icon {
  filter: var(--color-icon-filter-active);
}

.nav-label {
  font-size: 0.9rem;
  white-space: nowrap;
}
</style>