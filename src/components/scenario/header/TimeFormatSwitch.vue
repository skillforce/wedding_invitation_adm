<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePreferencesStore } from '@/stores/preferences'

const { t } = useI18n()
const prefs = usePreferencesStore()

const options = [
  { value: '24h' as const, label: t('scenario.timeFormat.h24') },
  { value: '12h' as const, label: t('scenario.timeFormat.h12') },
]
</script>

<template>
  <div class="time-format-switch">
    <span class="switch-label">{{ t('scenario.timeFormat.label') }}</span>
    <div class="switch-buttons">
      <button
        v-for="opt in options"
        :key="opt.value"
        type="button"
        class="switch-btn"
        :class="{ 'switch-btn--active': prefs.timeFormat === opt.value }"
        @click="prefs.setTimeFormat(opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>


<style scoped>
.time-format-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 1.5rem;
}

.switch-label {
  font-size: 12px;
  color: var(--color-text-muted);
  font-weight: 500;
  white-space: nowrap;
}

.switch-buttons {
  display: flex;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.switch-btn {
  height: 30px;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.15s;
}

.switch-btn:not(:last-child) {
  border-right: 1px solid var(--color-border);
}

.switch-btn:hover {
  color: var(--color-text-primary);
  background: var(--color-hover);
}

.switch-btn--active {
  background: var(--scenario-icon-accent);
  color: #fff;
}

.switch-btn--active:hover {
  background: var(--scenario-icon-accent);
  opacity: 0.9;
  color: #fff;
}
</style>