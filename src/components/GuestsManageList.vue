<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Select from 'primevue/select'
import type { GuestDetailViewDto } from '@/api/guests'
import personIconUrl from '@/assets/person.svg'

const props = defineProps<{
  guests: GuestDetailViewDto[]
  isAdding: boolean
}>()

const emit = defineEmits<{
  add: [name: string]
  remove: [id: number]
}>()

const { t } = useI18n()
const newGuestName = ref('')

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

function submitAdd() {
  const name = newGuestName.value.trim()
  if (name.length < 3) return
  emit('add', name)
  newGuestName.value = ''
}
</script>

<template>
  <section class="manage-section">
    <form class="add-form" @submit.prevent="submitAdd">
      <InputText
        v-model="newGuestName"
        :placeholder="t('guests.addGuestPlaceholder')"
        class="add-input"
        :minlength="3"
        :maxlength="20"
      />
      <Button
        type="submit"
        :loading="isAdding"
        :disabled="newGuestName.trim().length < 3"
        :aria-label="t('a11y.addGuest')"
        icon="pi pi-plus"
        size="small"
      />
    </form>

    <Select
      v-model="activeFilter"
      :options="filterOptions"
      option-label="label"
      option-value="value"
      class="filter-bar"
    />

    <ul v-if="filteredGuests.length" class="guest-list">
      <li v-for="guest in filteredGuests" :key="guest.id" class="guest-row">
        <img :src="personIconUrl" :alt="t('a11y.guestAvatar')" class="avatar-image" />
        <span class="guest-name">{{ guest.name }}</span>
        <span :class="['status-badge', guest.is_already_answered ? 'status--answered' : 'status--pending']">
          {{ guest.is_already_answered ? t('guests.answered') : t('guests.notAnswered') }}
        </span>
        <Button
          icon="pi pi-trash"
          size="small"
          severity="danger"
          text
          rounded
          :aria-label="t('a11y.removeGuest')"
          @click="emit('remove', guest.id)"
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

.add-form {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.add-input {
  flex: 1;
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

.guest-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--color-border-strong);
  background: var(--color-surface);
}

.avatar-image {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  flex-shrink: 0;
  object-fit: cover;
  filter: var(--color-avatar-filter-soft);
}

.guest-name {
  flex: 1;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-badge {
  font-size: 0.75rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  white-space: nowrap;
  flex-shrink: 0;
}

.status--answered {
  background: color-mix(in srgb, var(--p-green-500) 15%, transparent);
  color: var(--p-green-500);
}

.status--pending {
  background: color-mix(in srgb, var(--p-surface-400) 20%, transparent);
  color: var(--color-text-muted);
}

.empty-text {
  color: var(--color-text-muted);
  text-align: center;
  padding: 1rem 0;
}
</style>
