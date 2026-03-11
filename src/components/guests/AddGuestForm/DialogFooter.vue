<script setup lang="ts">
import Button from 'primevue/button'
import { useI18n } from 'vue-i18n'

defineProps<{
  isEditMode: boolean
  isAdding: boolean
  isUpdating: boolean
}>()

defineEmits<{
  cancel: []
  confirm: []
}>()

const { t } = useI18n()
</script>

<template>
  <div class="dialog-footer">
    <Button
      :label="t('budget.cancel')"
      severity="secondary"
      text
      @click="$emit('cancel')"
    />
    <Button
      :label="isEditMode ? t('guests.profile.updateButton') : t('guests.profile.saveButton')"
      :loading="isEditMode ? isUpdating : isAdding"
      @click="$emit('confirm')"
    />
  </div>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
