<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import ConfirmDialog from 'primevue/confirmdialog'
import { useGuestsStore } from '@/stores/guests'
import { useAuthStore } from '@/stores/auth'
import type { GuestDetailViewDto } from '@/api/guests'
import GuestsManageList from '@/components/guests/GuestsManageList.vue'
import GuestResponsePanel from '@/components/guests/GuestResponsePanel/index.vue'

const guestsStore = useGuestsStore()
const authStore = useAuthStore()
const guests = computed(() => guestsStore.guests)
const selectedGuestId = ref<string | null>(null)
const openEditSignal = ref(0)
const { t } = useI18n()
const hasInvitationUrl = computed(() => Boolean(authStore.user?.invitationUrl))

const selectedGuest = computed<GuestDetailViewDto | null>(
  () => guests.value.find((guest) => guest.id === selectedGuestId.value) ?? null,
)

watch(
  guests,
  (nextGuests) => {
    if (!nextGuests.length) {
      selectedGuestId.value = null
      return
    }

    const selectedStillExists = nextGuests.some((guest) => guest.id === selectedGuestId.value)
    if (!selectedStillExists) {
      selectedGuestId.value = nextGuests[0]?.id ?? null
    }
  },
  { immediate: true },
)

onMounted(async () => {
  await guestsStore.fetchGuests()
})

function requestEditSelectedGuest() {
  openEditSignal.value += 1
}
</script>

<template>
  <div class="guests-page">
    <ConfirmDialog :breakpoints="{'640px': '70vw'}" />
    <Card class="guests-card">
      <template #title>{{ t('guests.title') }}</template>
      <template #content>
        <p v-if="guestsStore.isLoading">{{ t('guests.loading') }}</p>
        <div v-else class="guests-layout">
          <GuestsManageList
            :guests="guests"
            :is-adding="guestsStore.isAdding"
            :is-updating="guestsStore.isUpdating"
            :selected-guest-id="selectedGuestId"
            :selected-guest="selectedGuest"
            :open-edit-signal="openEditSignal"
            @add="guestsStore.addGuest"
            @update="guestsStore.updateGuestForm"
            @remove="guestsStore.removeGuest"
            @select="selectedGuestId = $event"
          />
          <GuestResponsePanel
            v-if="hasInvitationUrl"
            :guest="selectedGuest"
            :is-updating="guestsStore.isUpdating"
            @edit="requestEditSelectedGuest"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.guests-page :deep(.guests-card) {
  background: transparent;
  border: none;
  box-shadow: none;
  color: var(--color-text-primary);
}

.guests-page :deep(.p-card-body) {
  width: 100%;
}

.guests-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(320px, 1fr);
  gap: 1rem;
  align-items: start;
}

@media (min-width: 901px) {
  .guests-page {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .guests-page :deep(.p-card) {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .guests-page :deep(.p-card-body) {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .guests-page :deep(.p-card-content) {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .guests-layout {
    flex: 1;
    min-height: 0;
    align-items: stretch;
  }
}

@media (max-width: 900px) {
  .guests-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .guests-page :deep(.p-card-body) {
    padding: 0.85rem;
  }
}
</style>
