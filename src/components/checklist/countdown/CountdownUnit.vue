<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  value: number
  labelKey: string
  pad?: boolean
}>()

const { t } = useI18n()

const display = computed(() =>
  props.pad ? String(props.value).padStart(2, '0') : String(props.value),
)
</script>

<template>
  <div class="countdown-unit">
    <span class="countdown-value">{{ display }}</span>
    <span class="countdown-label">{{ t(labelKey) }}</span>
  </div>
</template>

<style scoped>
.countdown-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 48px;
}

.countdown-value {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1;
  color: var(--color-text-strong);
  font-variant-numeric: tabular-nums;
}

.countdown-label {
  font-size: 0.68rem;
  color: var(--color-text-muted);
  margin-top: 2px;
}
</style>