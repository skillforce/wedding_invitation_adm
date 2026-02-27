<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Select from 'primevue/select'
import type { GuestDetailViewDto } from '@/api/guests.ts'
import GuestManageListItem from '@/components/guests/GuestManageListItem.vue'
import AddGuestForm from '@/components/guests/AddGuestForm.vue'

const props = defineProps<{
  guests: GuestDetailViewDto[]
  isAdding: boolean
}>()

const emit = defineEmits<{
  add: [name: string]
  remove: [id: number]
}>()

const { t } = useI18n()

type Filter = 'all' | 'answered' | 'pending'
const activeFilter = ref<Filter>('all')

const filterOptions = computed(() => [
  { label: t('guests.filterAll'), value: 'all' },
  { label: t('guests.answered'), value: 'answered' },
  { label: t('guests.notAnswered'), value: 'pending' },
])

const filteredGuests = computed(() => {
  if (activeFilter.value === 'answered') return props.guests.filter((g) => g.is_already_answered)
  if (activeFilter.value === 'pending') return props.guests.filter((g) => !g.is_already_answered)
  return props.guests
})

</script>

<template>
  <section class="manage-section">
    <AddGuestForm :is-adding="isAdding" @add="emit('add', $event)" />

    <Select
      v-model="activeFilter"
      :options="filterOptions"
      option-label="label"
      option-value="value"
      class="filter-bar"
    />

    <ul v-if="filteredGuests.length" class="guest-list">
      <li v-for="guest in filteredGuests" :key="guest.id">
        <GuestManageListItem
          :guest="guest"
          @remove="emit('remove', $event)"
        />
      </li>
    </ul>

    <p v-else class="empty-text">{{ guests.length ? t('guests.noMatchingGuests') : t('guests.empty') }}</p>
  </section>
</template>

<style scoped>
.manage-section {
  margin-top: 1rem;
  display: grid;
  gap: 1rem;
}

.filter-bar {
  align-self: start;
  max-width: 150px;
}

.guest-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
}

.empty-text {
  color: var(--color-text-muted);
  text-align: center;
  padding: 1rem 0;
}
</style>
