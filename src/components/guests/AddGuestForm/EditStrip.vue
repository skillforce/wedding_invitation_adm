<script setup lang="ts">
import Button from 'primevue/button'
import { useI18n } from 'vue-i18n'

defineProps<{
  guestName: string
  canEdit: boolean
  isUpdating: boolean
}>()

defineEmits<{
  edit: []
}>()

const { t } = useI18n()
</script>

<template>
  <div class="edit-strip">
    <div class="edit-copy">
      <span class="edit-kicker">{{ t('guests.profile.selectedGuest') }}</span>
      <strong class="edit-name">{{ guestName }}</strong>
    </div>
    <Button
      :label="t('guests.profile.editButton')"
      icon="pi pi-pen-to-square"
      severity="secondary"
      outlined
      size="small"
      :disabled="!canEdit"
      :loading="isUpdating"
      @click="$emit('edit')"
    />
  </div>
</template>

<style scoped>
.edit-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.8rem 0.95rem;
  border-radius: 18px;
  border: 1px solid color-mix(in srgb, var(--color-border-strong) 60%, transparent);
  background: color-mix(in srgb, var(--color-surface) 92%, white);
}

.edit-copy {
  display: grid;
  gap: 0.15rem;
  min-width: 0;
}

.edit-kicker {
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.edit-name {
  color: var(--color-title);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .edit-strip {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
