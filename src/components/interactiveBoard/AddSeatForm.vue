<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Select from 'primevue/select'
import { useGuestsStore } from '@/stores/guests'
import { useSeatingStore } from '@/stores/seating'

const emit = defineEmits<{
  add: [guestId: string]
}>()

const { t } = useI18n()
const guestsStore = useGuestsStore()
const seatingStore = useSeatingStore()

const selectedGuestId = ref<string | null>(null)

const seatedGuestIds = computed(() => {
  const ids = new Set<string>()
  for (const table of seatingStore.tables) {
    for (const guest of table.guests) {
      ids.add(guest.guestId)
    }
  }
  return ids
})

const availableGuests = computed(() =>
  guestsStore.guests
    .map((g) => ({ label: g.name, value: String(g.id) }))
    .filter((guest) => !seatedGuestIds.value.has(guest.value)),
)

function addGuest() {
  if (!selectedGuestId.value) return
  emit('add', selectedGuestId.value)
  selectedGuestId.value = null
}
</script>

<template>
  <div class="add-seat-form">
    <Select
      v-model="selectedGuestId"
      :options="availableGuests"
      option-label="label"
      option-value="value"
      :placeholder="t('seating.selectGuestPlaceholder')"
      :empty-message="t('seating.allGuestsSeated')"
      class="guest-select"
      filter
    />
    <Button
      icon="pi pi-user-plus"
      size="small"
      :disabled="!selectedGuestId"
      :aria-label="t('a11y.addGuest')"
      @click="addGuest"
    />
  </div>
</template>

<style scoped>
.add-seat-form {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: 2px;
}

.guest-select {
  flex: 1;
  min-width: 0;
}

.guest-select :deep(.p-select) {
  width: 100%;
  background: var(--board-guest-input-bg);
  border: 1px solid var(--board-guest-input-border);
  border-radius: 7px;
  color: var(--board-input-text);
  font-size: 14px;
  transition: border-color 0.18s;
}

.guest-select :deep(.p-select:not(.p-disabled).p-focus) {
  border-color: var(--board-guest-input-focus);
  box-shadow: none;
}
</style>
