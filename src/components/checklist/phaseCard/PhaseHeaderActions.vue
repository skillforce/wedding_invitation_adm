<template>
  <button
    v-if="isEditing"
    class="phase-remove-btn"
    title="Remove section"
    @click.stop="$emit('remove')"
  >
    <i class="pi pi-trash" />
  </button>

  <button
    class="phase-toggle-btn"
    :aria-label="isOpen ? t('checklist.collapse') : t('checklist.expand')"
    :aria-expanded="isOpen"
    @click.stop="$emit('toggle')"
  >
    <Transition name="icon-flip" mode="out-in">
      <i v-if="isOpen" key="up" class="pi pi-chevron-up" />
      <i v-else key="down" class="pi pi-chevron-down" />
    </Transition>
  </button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  isEditing: boolean
  isOpen: boolean
}>()

defineEmits<{ toggle: []; remove: [] }>()

const { t } = useI18n()
</script>

<style scoped>
.phase-remove-btn {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  transition: all 0.2s ease;
}

.phase-remove-btn:hover {
  border-color: #e08080;
  background: rgba(220, 80, 80, 0.1);
  color: #e08080;
}

.phase-toggle-btn {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  transition: all 0.2s ease;
}

.phase-toggle-btn:hover { background: var(--color-hover); color: var(--color-text-primary); }
.phase-toggle-btn:focus-visible { outline: 2px solid #7aad8c; outline-offset: 2px; }

.icon-flip-enter-active,
.icon-flip-leave-active { transition: all 0.2s ease; }
.icon-flip-enter-from { opacity: 0; transform: rotateX(90deg); }
.icon-flip-leave-to   { opacity: 0; transform: rotateX(-90deg); }
</style>
