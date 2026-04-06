<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'

defineProps<{ isProcessing: boolean }>()

const emit = defineEmits<{
  rotateLeft: []
  rotateRight: []
  cancel: []
  crop: []
}>()

const { t } = useI18n()
</script>

<template>
  <div class="cropper-footer">
    <div class="cropper-footer__tools">
      <Button
        icon="pi pi-undo"
        text
        rounded
        :aria-label="t('userProfile.cropDialog.rotateLeft')"
        @click="emit('rotateLeft')"
      />
      <Button
        icon="pi pi-refresh"
        text
        rounded
        :aria-label="t('userProfile.cropDialog.rotateRight')"
        @click="emit('rotateRight')"
      />
    </div>
    <div class="cropper-footer__actions">
      <Button
        :label="t('userProfile.cropDialog.cancel')"
        text
        severity="secondary"
        @click="emit('cancel')"
      />
      <Button
        :label="isProcessing ? t('userProfile.cropDialog.processing') : t('userProfile.cropDialog.confirm')"
        :loading="isProcessing"
        @click="emit('crop')"
      />
    </div>
  </div>
</template>

<style scoped>
.cropper-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
}

.cropper-footer__tools {
  display: flex;
  gap: 0.25rem;
}

.cropper-footer__actions {
  display: flex;
  gap: 0.5rem;
}
</style>