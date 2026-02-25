<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import closeIconUrl from '@/assets/close.svg'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()
const { t } = useI18n()
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="bottom-drawer-backdrop" @click="emit('close')" />
    <div :class="['bottom-drawer', { open }]" role="dialog" :aria-hidden="!open">
      <div class="bottom-drawer-header">
        <button class="bottom-drawer-close" :aria-label="t('a11y.closeMenu')" @click="emit('close')">
          <img :src="closeIconUrl" class="close-icon" :alt="t('a11y.closeIcon')" />
        </button>
      </div>
      <div class="bottom-drawer-content">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.bottom-drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: var(--z-drawer-backdrop);
  background: var(--color-backdrop);
}

.bottom-drawer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-drawer);
  max-height: 80dvh;
  border-radius: 16px 16px 0 0;
  background: var(--color-sidebar-bg);
  color: var(--color-text-primary);
  padding: 0.75rem;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 0.75rem;
  transform: translateY(100%);
  transition: transform 0.25s ease;
  pointer-events: none;
}

.bottom-drawer.open {
  transform: translateY(0);
  pointer-events: auto;
}

.bottom-drawer-header {
  display: flex;
  justify-content: flex-end;
}

.bottom-drawer-close {
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

.bottom-drawer-close:hover {
  background: var(--color-hover);
}

.close-icon {
  width: 20px;
  height: 20px;
  filter: var(--color-icon-filter);
}

.bottom-drawer-content {
  overflow-y: auto;
  min-height: 0;
}
</style>
