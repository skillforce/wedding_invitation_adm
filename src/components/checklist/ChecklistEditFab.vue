<template>
  <button class="edit-fab" :class="{ 'edit-fab--active': isEditing }" @click="$emit('toggle')">
    <Transition name="icon-flip" mode="out-in">
      <i v-if="isEditing" key="done" class="pi pi-check" />
      <i v-else key="edit" class="pi pi-pencil" />
    </Transition>
    <span>{{ isEditing ? t('checklist.editDone') : t('checklist.edit') }}</span>
  </button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  isEditing: boolean
}>()

defineEmits<{
  toggle: []
}>()
</script>

<style scoped>
.edit-fab {
  position: fixed;
  top: 7.8rem;
  right: 4rem;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 18px 0 14px;
  border-radius: 100px;
  background: var(--color-surface);
  border: 1.5px solid var(--color-border-strong);
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.edit-fab:hover {
  border-color: #7aad8c;
  color: #7aad8c;
}

.edit-fab--active {
  background: #7aad8c;
  border-color: #7aad8c;
  color: #fff;
}

.edit-fab--active:hover {
  opacity: 0.9;
  color: #fff;
}

.edit-fab i {
  font-size: 14px;
}

.icon-flip-enter-active,
.icon-flip-leave-active {
  transition: all 0.18s ease;
}

.icon-flip-enter-from {
  opacity: 0;
  transform: rotateX(90deg);
}

.icon-flip-leave-to {
  opacity: 0;
  transform: rotateX(-90deg);
}

@media (max-width: 768px) {
  .edit-fab {
    height: 34px;
    top: 6.5rem;
    right: 1rem;
    padding: 0 10px 0 10px;
  }

}
</style>
