<script setup lang="ts">
import { computed } from 'vue'
import type { GuestDetailViewDto } from '@/api/guests.ts'
import GuestIdentity from './GuestIdentity.vue'
import GuestActions from './GuestActions.vue'

const props = defineProps<{
  guest: GuestDetailViewDto
  isSelected: boolean
  number: number
  highlightQuery?: string
}>()

const emit = defineEmits<{
  remove: [id: string]
  select: [id: string]
}>()

const extraCount = computed(() => {
  const hasKids = props.guest.guestForm?.has_kids_attending ?? false
  const hasCouple = props.guest.guestForm?.ifWithCouple?.response === true

  const kidsSeats = hasKids
    ? Math.max(0, props.guest.guestForm?.amount_of_kids ?? 0)
    : 0
  const coupleNotInListSeat = (hasCouple && !props.guest.guestForm?.ifWithCouple?.coupleId) ? 1 : 0
  const plusOneSeats = (hasCouple || hasKids)
    ? 0
    : (props.guest.response?.plus_one ? 1 : 0)

  return kidsSeats + plusOneSeats + coupleNotInListSeat
})
</script>

<template>
  <div
    :class="['guest-row', isSelected && 'guest-row--selected']"
    role="button"
    tabindex="0"
    @click="emit('select', guest.id)"
    @keydown.enter.prevent="emit('select', guest.id)"
    @keydown.space.prevent="emit('select', guest.id)"
  >
    <GuestIdentity
      :guest-id="guest.id"
      :name="guest.name"
      :number="number"
      :extra-count="extraCount"
      :highlight-query="highlightQuery"
    />
    <GuestActions
      :guest-id="guest.id"
      :guest-name="guest.name"
      :is-already-answered="guest.is_already_answered"
      @remove="emit('remove', $event)"
    />
  </div>
</template>

<style scoped>
.guest-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.6rem;
  border-radius: 8px;
  border: 1px solid var(--color-border-strong);
  background: var(--color-surface);
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.guest-row:hover,
.guest-row:focus-visible {
  border-color: color-mix(in srgb, var(--p-primary-400) 55%, var(--color-border-strong));
  box-shadow: 0 12px 30px color-mix(in srgb, var(--p-primary-300) 12%, transparent);
  outline: none;
  transform: translateY(-1px);
}

.guest-row--selected {
  border-color: var(--p-primary-400);
  background: color-mix(in srgb, var(--p-primary-100) 20%, var(--color-surface));
}

</style>
