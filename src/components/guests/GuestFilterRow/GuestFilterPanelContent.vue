<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Select from 'primevue/select'
import GuestProfileFilter from '@/components/guests/GuestFilterRow/GuestProfileFilter.vue'
import type { GuestProfileFilterState } from '@/components/guests/GuestFilterRow/GuestProfileFilter.vue'
import type { GuestFilter } from '@/components/guests/GuestFilterRow/GuestFilterRow.vue'

const props = defineProps<{
  responseFilter: GuestFilter
  profileFilter: GuestProfileFilterState
  hasInvitationUrl?: boolean
}>()

const emit = defineEmits<{
  'update:responseFilter': [value: GuestFilter]
  'update:profileFilter': [value: GuestProfileFilterState]
}>()

const { t } = useI18n()

const responseFilterOptions = computed(() => props.hasInvitationUrl
  ? [
    { label: t('guests.filterAll'), value: 'all' },
    { label: t('guests.answered'), value: 'answered' },
    { label: t('guests.notAnswered'), value: 'pending' },
  ]
  : [
    { label: t('guests.filterAll'), value: 'all' },
  ])
</script>

<template>
  <div class="filter-panel">
    <section class="filter-section">
      <p class="filter-title">{{ t('guests.filterSections.response') }}</p>
      <Select
        :model-value="responseFilter"
        :options="responseFilterOptions"
        option-label="label"
        option-value="value"
        class="filter-select"
        @update:model-value="emit('update:responseFilter', $event)"
      />
    </section>

    <section class="filter-section">
      <p class="filter-title">{{ t('guests.filterSections.profileField') }}</p>
      <GuestProfileFilter
        :model-value="profileFilter"
        @update:model-value="emit('update:profileFilter', $event)"
      />
    </section>
  </div>
</template>

<style scoped>
.filter-panel {
  display: grid;
  gap: 1rem;
  min-width: min(440px, calc(100vw - 3rem));
}

.filter-section {
  display: grid;
  gap: 0.45rem;
}

.filter-title {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.filter-select {
  width: 100%;
}

@media (max-width: 640px) {
  .filter-panel {
    min-width: 0;
  }
}
</style>
