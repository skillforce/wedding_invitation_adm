<script setup lang="ts">
import type { GuestsViewDto } from '@/api/guests'
import GuestListItem from '@/components/GuestListItem.vue'

defineProps<{
  guests: GuestsViewDto[]
}>()
</script>

<template>
  <section class="guests-grid">
    <div class="dashboard-title">Ответившие гости:</div>
    <GuestListItem
      v-for="guest in guests"
      :key="guest.id"
      :guest="guest"
    />
  </section>
</template>

<style scoped>
.guests-grid {
  margin-top: 1rem;
  display: grid;
  gap: 0.75rem;
}
.dashboard-title{
  margin-left: 0.75rem;
  font-size: 1.25rem;
  color: var(--color-title);
}
</style>
