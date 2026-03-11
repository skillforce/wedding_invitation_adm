<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  responded: boolean
  variant?: 'badge' | 'inline'
  labelScope?: 'guest' | 'response'
  pendingIcon?: 'minus' | 'clock'
}>()

const { t } = useI18n()

const label = computed(() => (
  props.labelScope === 'guest'
    ? (props.responded ? t('guests.answered') : t('guests.notAnswered'))
    : (props.responded ? t('guests.responsePanel.responded') : t('guests.responsePanel.notResponded'))
))

const iconClass = computed(() => {
  if (props.responded) return 'pi pi-check-circle'
  return props.pendingIcon === 'clock' ? 'pi pi-clock' : 'pi pi-minus-circle'
})
</script>

<template>
  <span
    :class="[
      'response-mark',
      `response-mark--${variant ?? 'inline'}`,
      responded ? 'response-mark--active' : 'response-mark--muted',
    ]"
  >
    <i :class="iconClass" />
    <span class="response-mark__label">{{ label }}</span>
  </span>
</template>

<style scoped>
.response-mark {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-weight: 600;
}

.response-mark--badge {
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  font-size: 0.78rem;
  white-space: nowrap;
}

.response-mark--inline {
  font-size: 0.78rem;
}

.response-mark--active {
  color: var(--p-green-500);
}

.response-mark--active.response-mark--badge {
  background: color-mix(in srgb, var(--p-green-500) 15%, transparent);
}

.response-mark--muted {
  color: var(--color-text-muted);
}

.response-mark--muted.response-mark--badge {
  background: color-mix(in srgb, var(--p-surface-400) 20%, transparent);
}

.response-mark__label {
  min-width: 0;
}
</style>
