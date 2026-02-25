<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useLocaleStore } from '@/stores/locale'
import type { AppLocale } from '@/i18n'

const localeStore = useLocaleStore()
const { locale } = storeToRefs(localeStore)
const { t } = useI18n()

const selectedLocale = computed({
  get: () => locale.value,
  set: (value: AppLocale) => localeStore.setLocale(value),
})

const localeOptions = computed(() => [
  { value: 'ru' as const, label: t('locale.russian') },
  { value: 'en' as const, label: t('locale.english') },
])
</script>

<template>
  <label class="locale-switch">
    <span class="sr-only">{{ t('locale.switchAriaLabel') }}</span>
    <select v-model="selectedLocale" class="locale-select" :aria-label="t('locale.switchAriaLabel')">
      <option
        v-for="option in localeOptions"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </label>
</template>

<style scoped>
.locale-switch {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--color-theme-switch-border);
  border-radius: 999px;
  background: var(--color-theme-switch-bg);
  padding: 0.2rem 0.45rem;
}

.locale-select {
  border: none;
  outline: none;
  background: transparent;
  color: var(--color-theme-switch-label);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
}

.locale-select option {
  color: #0f1728;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
