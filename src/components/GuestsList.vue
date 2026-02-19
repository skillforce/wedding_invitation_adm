<script setup lang="ts">
import type { GuestsViewDto } from '@/api/guests'
import GuestListItem from '@/components/GuestListItem.vue'

defineProps<{
  guests: GuestsViewDto[]
}>()
</script>

<template>
  <div class="guests-grid">
    <GuestListItem
      v-for="guest in guests"
      :key="guest.id"
      :guest="guest"
    />
  </div>
</template>

<style scoped>
.guests-grid {
  margin-top: 1rem;
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}
</style>
