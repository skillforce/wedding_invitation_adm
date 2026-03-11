<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import { useGuestsStore } from '@/stores/guests'
import type { GuestDetailViewDto } from '@/api/guests'
import GuestsManageList from '@/components/guests/GuestsManageList.vue'
import GuestResponsePanel from '@/components/guests/GuestResponsePanel/index.vue'

const guestsStore = useGuestsStore()
const guests = computed(() => guestsStore.guests)
const selectedGuestId = ref<string | null>(null)
const { t } = useI18n()

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
</script>

<template>
  <div class="guests-page">
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
            @add="guestsStore.addGuest"
            @update="guestsStore.updateGuestForm"
            @remove="guestsStore.removeGuest"
            @select="selectedGuestId = $event"
          />
          <GuestResponsePanel :guest="selectedGuest" />
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
