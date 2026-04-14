<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'

defineProps<{
  login: string
}>()

defineEmits<{
  back: []
}>()

const { t } = useI18n()
</script>

<template>
  <div class="context-banner">
    <Button
      icon="pi pi-arrow-left"
      text
      severity="secondary"
      class="back-btn"
      @click="$emit('back')"
    />
    <span class="context-label">
      {{ t('userProfile.editingUser', { login }) }}
    </span>
  </div>
</template>

<style scoped>
.context-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--color-sidebar-bg);
  border: 1px solid var(--color-border);
  border-radius: 10px;
}

.back-btn {
  flex-shrink: 0;
}

.context-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-primary);
}
</style>