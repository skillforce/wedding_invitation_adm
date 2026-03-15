<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Select from 'primevue/select'
import GuestCountLabel from '@/components/guests/GuestFilterRow/GuestCountLabel.vue'

export type GuestFilter = 'all' | 'answered' | 'pending'

defineProps<{
  modelValue: GuestFilter
  countLabel: string
  plusOneCount?: number
}>()

const emit = defineEmits<{ 'update:modelValue': [value: GuestFilter] }>()

const { t } = useI18n()

const filterOptions = computed(() => [
  { label: t('guests.filterAll'), value: 'all' },
  { label: t('guests.answered'), value: 'answered' },
  { label: t('guests.notAnswered'), value: 'pending' },
])
</script>

<template>
  <div class="filter-row">
    <Select
      :model-value="modelValue"
      :options="filterOptions"
      option-label="label"
      option-value="value"
      class="filter-bar"
      @update:model-value="emit('update:modelValue', $event)"
    />
    <GuestCountLabel :label="countLabel" :plus-one-count="plusOneCount" />
  </div>
</template>

<style scoped>
.filter-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-bar {
  align-self: start;
  max-width: 150px;
}
</style>
