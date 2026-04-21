<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useScenarioStore } from '@/stores/scenario'
import { usePreferencesStore } from '@/stores/preferences'
import { exportScenarioTxt, exportScenarioPdf } from '@/utils/scenario/scenario.utils'

const { t, locale } = useI18n()
const store = useScenarioStore()
const prefs = usePreferencesStore()

function onTxt() {
  exportScenarioTxt(
    store.points,
    t('scenario.title'),
    prefs.timeFormat,
    (icon) => t(`scenario.icons.${icon}`),
    locale.value,
  )
}

function onPdf() {
  exportScenarioPdf(
    store.points,
    t('scenario.title'),
    prefs.timeFormat,
    (icon) => t(`scenario.icons.${icon}`),
    locale.value,
  )
}
</script>

<template>
  <div class="export-menu">
    <button
      type="button"
      class="export-btn"
      :disabled="store.points.length === 0"
      :title="t('scenario.export.txt')"
      @click="onTxt"
    >
      <i class="pi pi-file-export" />
      TXT
    </button>

    <button
      type="button"
      class="export-btn"
      :disabled="store.points.length === 0"
      :title="t('scenario.export.pdf')"
      @click="onPdf"
    >
      <i class="pi pi-file-pdf" />
      PDF
    </button>
  </div>
</template>

<style scoped>
.export-menu {
  display: flex;
  gap: 5px;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.1em;
  transition: all 0.15s;
}

.export-btn i {
  font-size: 12px;
}

.export-btn:hover:not(:disabled) {
  border-color: var(--scenario-icon-accent);
  color: var(--scenario-icon-accent);
}

.export-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
</style>