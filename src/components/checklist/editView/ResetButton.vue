<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useConfirm } from 'primevue/useconfirm'
import { useChecklistStore } from '@/stores/checklist'

const { t } = useI18n()
const confirm = useConfirm()
const store = useChecklistStore()

function confirmReset() {
  confirm.require({
    header: t('checklist.resetConfirmHeader'),
    message: t('checklist.resetConfirmMessage'),
    icon: 'pi pi-refresh',
    acceptClass: 'p-button-danger',
    accept: () => store.resetAll(),
  })
}
</script>

<template>
  <button class="reset-btn" @click="confirmReset">
    <i class="pi pi-refresh" />
    {{ t('checklist.resetToDefaults') }}
  </button>
</template>

<style scoped>
.reset-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 42px;
  border-radius: 12px;
  border: 1.5px dashed rgba(220, 80, 80, 0.35);
  background: rgba(220, 80, 80, 0.06);
  color: #e08080;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-btn:hover {
  border-color: rgba(220, 80, 80, 0.6);
  background: rgba(220, 80, 80, 0.12);
}

.reset-btn i {
  font-size: 14px;
}
</style>
