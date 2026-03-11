<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import GuestResponseFieldList from '@/components/guests/GuestResponsePanel/GuestResponseFieldList.vue'

defineProps<{
  fields: Array<{ label: string; value: string }>
}>()

const { t } = useI18n()
</script>

<template>
  <section class="response-section">
    <div class="section-title">{{ t('guests.responsePanel.profileTitle') }}</div>
    <GuestResponseFieldList v-if="fields.length" :fields="fields" />
    <p v-else class="response-empty-text">{{ t('guests.responsePanel.profileMissing') }}</p>
  </section>
</template>

<style scoped>
.response-section {
  border-radius: 18px;
  border: 1px solid color-mix(in srgb, var(--color-border-strong) 65%, transparent);
  background: color-mix(in srgb, var(--color-surface) 88%, white);
  padding: 0.9rem 1rem 1rem;
  display: grid;
  gap: 0.8rem;
}

.section-title {
  font-weight: 700;
  color: var(--color-title);
}

.response-empty-text {
  margin: 0;
  color: var(--color-text-muted);
}
</style>
