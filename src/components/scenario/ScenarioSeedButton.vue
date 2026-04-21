<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useConfirm } from 'primevue/useconfirm'
import { useScenarioStore } from '@/stores/scenario'

const { t } = useI18n()
const confirm = useConfirm()
const store = useScenarioStore()

function confirmSeed() {
  confirm.require({
    header: t('scenario.seedConfirmHeader'),
    message: t('scenario.seedConfirmMessage'),
    icon: 'pi pi-refresh',
    acceptClass: 'p-button-danger',
    accept: () => store.seedScenario(),
  })
}
</script>

<template>
  <button class="seed-btn" @click="confirmSeed">
    <i class="pi pi-refresh" />
    {{ t('scenario.seedButton') }}
  </button>
</template>

<style scoped>
.seed-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 38px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1.5px dashed rgba(220, 80, 80, 0.35);
  background: rgba(220, 80, 80, 0.06);
  color: #e08080;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.seed-btn:hover {
  border-color: rgba(220, 80, 80, 0.6);
  background: rgba(220, 80, 80, 0.12);
}

.seed-btn i {
  font-size: 13px;
}
</style>