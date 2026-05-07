<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { GuestDetailViewDto, GuestFormDto, NewGuestPayload } from '@/api/guests.ts'
import GuestManageListItem from '@/components/guests/GuestManageListItem/index.vue'
import AddGuestForm from '@/components/guests/AddGuestForm/index.vue'
import GuestFilterRow, { type GuestFilter } from '@/components/guests/GuestFilterRow/GuestFilterRow.vue'
import { useAuthStore } from '@/stores/auth'
import { matchesProfileFilter } from "@/components/guests/GuestFilterRow/utils.ts";
import type { GuestProfileFilterState } from "@/components/guests/GuestFilterRow/types.ts";

const props = defineProps<{
  guests: GuestDetailViewDto[]
  isAdding: boolean
  isUpdating: boolean
  selectedGuestId: string | null
  selectedGuest: GuestDetailViewDto | null
  openEditSignal?: number
}>()

const emit = defineEmits<{
  add: [payload: NewGuestPayload]
  update: [id: string, payload: GuestFormDto]
  remove: [id: string]
  select: [id: string | null]
}>()

const { t } = useI18n()
const authStore = useAuthStore()

const activeFilter = ref<GuestFilter>('all')
const draftGuestName = ref('')
const profileFilter = ref<GuestProfileFilterState>({
  field: null,
  value: null,
})
const hasInvitationUrl = computed(() => Boolean(authStore.user?.profile?.invitationUrl))
const hasActiveProfileFilter = computed(() => (
  profileFilter.value.field !== null && profileFilter.value.value !== null
))

function updateProfileFilter(nextFilter: GuestProfileFilterState) {
  profileFilter.value = nextFilter
}

function clearFilters() {
  activeFilter.value = 'all'
  profileFilter.value = {
    field: null,
    value: null,
  }
}

const filteredGuests = computed(() => {
  let guests = props.guests

  if (activeFilter.value === 'answered') {
    guests = guests.filter((guest) => guest.is_already_answered)
  } else if (activeFilter.value === 'pending') {
    guests = guests.filter((guest) => !guest.is_already_answered)
  }

  if (profileFilter.value.field && profileFilter.value.value !== null) {
    guests = guests.filter((guest) => matchesProfileFilter(
      guest,
      profileFilter.value.field!,
      profileFilter.value.value,
    ))
  }

  const nameQuery = draftGuestName.value.trim().toLowerCase()
  if (nameQuery) {
    guests = guests.filter((guest) => guest.name.toLowerCase().includes(nameQuery))
  }

  return guests
})

const isAllUnfiltered = computed(() => activeFilter.value === 'all' && !hasActiveProfileFilter.value)
const partnerPlusCount = computed(() => {
  if (!isAllUnfiltered.value) return undefined
  return props.guests.reduce((sum, g) => {
    if (g.response?.plus_one !== true && !g.guestForm?.ifWithCouple?.response) return sum

    const hasCoupleInForm = g.guestForm?.ifWithCouple?.response === true
    const coupleInGuestList = Boolean(g.guestForm?.ifWithCouple?.coupleId)

    if (hasCoupleInForm && coupleInGuestList) {
      return sum
    }
    return sum + 1
  }, 0)
})


const kidsPlusCount = computed(() => {
  if (!isAllUnfiltered.value) return undefined
  return props.guests.reduce((sum, g) => {
    return sum + (g.guestForm?.has_kids_attending ? (g.guestForm.amount_of_kids ?? 0) : 0)
  }, 0)
})

const countLabel = computed(() => {
  const total = props.guests.length
  const filtered = filteredGuests.value.length
  if (activeFilter.value === 'all') return t('guests.countAll', { count: total })
  if (activeFilter.value === 'answered') return t('guests.countAnswered', { count: filtered, total })
  return t('guests.countPending', { count: filtered, total })
})

watch(
  hasInvitationUrl,
  (value) => {
    if (!value && activeFilter.value !== 'all') {
      activeFilter.value = 'all'
    }
  },
  { immediate: true },
)

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
      :guests="guests"
      :is-adding="isAdding"
      :is-updating="isUpdating"
      :editing-guest="selectedGuest"
      :open-edit-signal="openEditSignal"
      @add="emit('add', $event)"
      @update="emit('update', $event.id, $event.payload)"
      @update:draft-name="draftGuestName = $event"
    />

    <GuestFilterRow
      v-model="activeFilter"
      :profile-filter="profileFilter"
      :count-label="countLabel"
      :partner-plus-count="partnerPlusCount"
      :kids-plus-count="kidsPlusCount"
      :has-invitation-url="hasInvitationUrl"
      @update:profile-filter="updateProfileFilter"
      @clear="clearFilters"
    />

    <ul v-if="filteredGuests.length" class="guest-list">
      <li v-for="(guest, index) in filteredGuests" :key="guest.id">
        <GuestManageListItem
          :guest="guest"
          :number="index + 1"
          :is-selected="guest.id === selectedGuestId"
          :highlight-query="draftGuestName"
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
    max-height: calc(5 * 45px + 4 * 0.5rem);
    overflow-y: auto;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;
    padding: 0.6rem 0.4rem;
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(12px);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  }
}
</style>
