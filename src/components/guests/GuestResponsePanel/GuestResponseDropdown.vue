<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import GuestResponseFieldList from '@/components/guests/GuestResponsePanel/GuestResponseFieldList.vue'
import GuestResponseMark from '@/components/guests/GuestResponsePanel/GuestResponseMark.vue'

defineProps<{
  responded: boolean
  fields: Array<{ label: string; value: string; marked: boolean }>
}>()

const { t } = useI18n()
</script>

<template>
  <details class="response-dropdown" open>
    <summary class="response-summary">
      <span>{{ t('guests.responsePanel.responseTitle') }}</span>
      <GuestResponseMark :responded="responded" />
    </summary>

    <GuestResponseFieldList v-if="responded" :fields="fields" padded />

    <p v-else class="response-empty-text">{{ t('guests.responsePanel.responseMissing') }}</p>
  </details>
</template>

<style scoped>
.response-dropdown {
  border-radius: 18px;
  border: 1px solid color-mix(in srgb, var(--color-border-strong) 65%, transparent);
  background: color-mix(in srgb, var(--color-surface) 88%, white);
  overflow: hidden;
}

.response-summary {
  list-style: none;
  padding: 0.9rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 700;
  color: var(--color-title);
}

.response-summary::-webkit-details-marker {
  display: none;
}

.response-empty-text {
  margin: 0;
  padding: 0 1rem 1rem;
  color: var(--color-text-muted);
}
</style>
