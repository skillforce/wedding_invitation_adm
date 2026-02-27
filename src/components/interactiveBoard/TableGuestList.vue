<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { SeatingTable } from '@/stores/seating'
import { useSeatingStore } from '@/stores/seating'
import AddSeatForm from './AddSeatForm.vue'

const props = defineProps<{
  table: SeatingTable
}>()

const { t } = useI18n()
const seatingStore = useSeatingStore()

function addGuest(name: string) {
  seatingStore.addGuest(props.table.id, name)
}

function removeGuest(guestId: string) {
  seatingStore.removeGuest(props.table.id, guestId)
}
</script>

<template>
  <div class="table-guest-list">
    <p class="section-label">
      {{ t('seating.sectionGuests') }}
      <span class="guest-count">{{ table.guests.length }}</span>
    </p>

    <ul class="guest-list">
      <li v-if="table.guests.length === 0" class="guest-empty">{{ t('seating.noGuestsYet') }}</li>
      <li v-for="guest in table.guests" :key="guest.id" class="guest-item">
        <span class="guest-name">{{ guest.name }}</span>
        <button class="remove-btn" :aria-label="t('a11y.removeGuest')" @click="removeGuest(guest.id)">✕</button>
      </li>
    </ul>

    <AddSeatForm @add="addGuest" />
  </div>
</template>

<style scoped>
.table-guest-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-label {
  margin: 0;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--board-section-text);
  display: flex;
  align-items: center;
  gap: 7px;
}

.guest-count {
  background: var(--board-badge-bg);
  color: var(--board-badge-text);
  border-radius: 10px;
  padding: 1px 7px;
  font-size: 10px;
  font-weight: 600;
}

.guest-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.guest-empty {
  font-size: 12px;
  color: var(--board-empty-text);
  padding: 10px 0;
  text-align: center;
  font-style: italic;
}

.guest-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--board-item-bg);
  border: 1px solid var(--board-item-border);
  border-radius: 7px;
  padding: 7px 10px;
  gap: 8px;
}

.guest-name {
  font-size: 13px;
  color: var(--board-item-text);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-btn {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border: none;
  background: transparent;
  color: var(--board-remove-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  border-radius: 4px;
  transition: background 0.15s, color 0.15s;
}

.remove-btn:hover {
  background: var(--board-remove-hover-bg);
  color: var(--board-remove-hover-text);
}
</style>