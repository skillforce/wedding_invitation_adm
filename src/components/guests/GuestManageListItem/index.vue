<script setup lang="ts">
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
      :highlight-query="highlightQuery"
    />
    <GuestActions
      :guest-id="guest.id"
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

@media (max-width: 480px) {
  .guest-row :deep(.response-mark--badge) {
    padding: 0.15rem 0.2rem;
  }

  .guest-row :deep(.response-mark--muted.response-mark--badge .response-mark__label) {
    display: none;
  }

  .guest-row :deep(.response-mark--muted.response-mark--badge) {
    gap: 0;
  }

  .guest-row :deep(.response-mark--muted.response-mark--badge .pi) {
    font-size: 0.75rem;
  }
}
</style>
