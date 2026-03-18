<script setup lang="ts">
import { computed, ref } from 'vue'
import GuestFilterActions from '@/components/guests/GuestFilterRow/GuestFilterActions.vue'
import GuestCountLabel from '@/components/guests/GuestFilterRow/GuestCountLabel.vue'
import GuestFiltersOverlay from '@/components/guests/GuestFilterRow/GuestFiltersOverlay.vue'
import type { GuestProfileFilterState } from '@/components/guests/GuestFilterRow/GuestProfileFilter.vue'

export type GuestFilter = 'all' | 'answered' | 'pending'

const props = defineProps<{
  modelValue: GuestFilter
  profileFilter: GuestProfileFilterState
  countLabel: string
  plusOneCount?: number
  hasInvitationUrl?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: GuestFilter]
  'update:profileFilter': [value: GuestProfileFilterState]
  clear: []
}>()

const filtersOverlayRef = ref<InstanceType<typeof GuestFiltersOverlay> | null>(null)

const hasActiveProfileFilter = computed(() => (
  props.profileFilter.field !== null || props.profileFilter.value !== null
))
const hasActiveFilters = computed(() => props.modelValue !== 'all' || hasActiveProfileFilter.value)

function toggleFilters(event: MouseEvent) {
  filtersOverlayRef.value?.toggle(event)
}

function clearFilters() {
  emit('clear')
  filtersOverlayRef.value?.hide()
}
</script>

<template>
  <div class="filter-row">
    <GuestFilterActions
      :has-active-filters="hasActiveFilters"
      @toggle="toggleFilters"
      @clear="clearFilters"
    />
    <GuestCountLabel :label="countLabel" :plus-one-count="plusOneCount" />

    <GuestFiltersOverlay
      ref="filtersOverlayRef"
      :response-filter="modelValue"
      :profile-filter="profileFilter"
      :has-invitation-url="hasInvitationUrl"
      @update:response-filter="emit('update:modelValue', $event)"
      @update:profile-filter="emit('update:profileFilter', $event)"
    />
  </div>
</template>

<style scoped>
.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .filter-row {
    gap: 0.65rem;
    align-items: flex-start;
  }
}
</style>
