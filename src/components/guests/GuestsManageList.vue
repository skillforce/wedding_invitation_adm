<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { GuestDetailViewDto, GuestFormDto, NewGuestPayload } from '@/api/guests.ts'
import GuestManageListItem from '@/components/guests/GuestManageListItem.vue'
import AddGuestForm from '@/components/guests/AddGuestForm/index.vue'
import GuestFilterRow, { type GuestFilter } from '@/components/guests/GuestFilterRow/GuestFilterRow.vue'

const props = defineProps<{
  guests: GuestDetailViewDto[]
  isAdding: boolean
  isUpdating: boolean
  selectedGuestId: string | null
  selectedGuest: GuestDetailViewDto | null
}>()

const emit = defineEmits<{
  add: [payload: NewGuestPayload]
  update: [id: string, payload: GuestFormDto]
  remove: [id: string]
  select: [id: string | null]
}>()

const { t } = useI18n()

const activeFilter = ref<GuestFilter>('all')

const filteredGuests = computed(() => {
  if (activeFilter.value === 'answered') return props.guests.filter((g) => g.is_already_answered)
  if (activeFilter.value === 'pending') return props.guests.filter((g) => !g.is_already_answered)
  return props.guests
})

const plusOneCount = computed(() =>
  activeFilter.value === 'all'
    ? props.guests.filter((g) => g.response?.plus_one === true).length
    : undefined,
)

const countLabel = computed(() => {
  const total = props.guests.length
  const filtered = filteredGuests.value.length
  if (activeFilter.value === 'all') return t('guests.countAll', { count: total })
  if (activeFilter.value === 'answered') return t('guests.countAnswered', { count: filtered, total })
  return t('guests.countPending', { count: filtered, total })
})

watch(
  filteredGuests,
  (nextGuests) => {
    if (!nextGuests.length) {
      emit('select', null)
      return
    }

    const selectedStillVisible = nextGuests.some((guest) => guest.id === props.selectedGuestId)
    if (!selectedStillVisible) {
      emit('select', nextGuests[0]?.id ?? null)
    }
  },
  { immediate: true },
)
</script>

<template>
  <section class="manage-section">
    <AddGuestForm
      :is-adding="isAdding"
      :is-updating="isUpdating"
      :editing-guest="selectedGuest"
      @add="emit('add', $event)"
      @update="emit('update', $event.id, $event.payload)"
    />

    <GuestFilterRow
      v-model="activeFilter"
      :count-label="countLabel"
      :plus-one-count="plusOneCount"
    />

    <ul v-if="filteredGuests.length" class="guest-list">
      <li v-for="(guest, index) in filteredGuests" :key="guest.id">
        <GuestManageListItem
          :guest="guest"
          :number="index + 1"
          :is-selected="guest.id === selectedGuestId"
          @remove="emit('remove', $event)"
          @select="emit('select', $event)"
        />
      </li>
    </ul>

    <p v-else class="empty-text">{{ guests.length ? t('guests.noMatchingGuests') : t('guests.empty') }}</p>
  </section>
</template>

<style scoped>
.manage-section {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}



.guest-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
  align-content: start;
}

@media (min-width: 901px) {
  .manage-section {
    height: 100%;
    min-height: 0;
  }

  .guest-list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
}

.empty-text {
  color: var(--color-text-muted);
  text-align: center;
  padding: 1rem 0;
}

@media (max-width: 900px) {
  .guest-list {
    max-height: calc(5 * 42px + 4 * 0.5rem);
    overflow-y: auto;
  }
}
</style>
