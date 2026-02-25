<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Message from 'primevue/message'
import { useGuestsStore } from '@/stores/guests'
import GuestsList from '@/components/GuestsList.vue'

const guestsStore = useGuestsStore()
const guests = computed(() => guestsStore.guests)
const viewMode = ref<'grid' | 'list'>('grid')
const { t } = useI18n()

onMounted(async () => {
  if (!guestsStore.guests.length) {
    await guestsStore.fetchGuests()
  }
})
</script>

<template>
  <div class="guests-page">
    <Card class="guests-card">
      <template #title>{{ t('guests.title') }}</template>
      <template #content>
        <Message v-if="guestsStore.errorKey" severity="error" size="small" variant="simple">
          {{ t(guestsStore.errorKey) }}
        </Message>

        <p v-else-if="guestsStore.isLoading">{{ t('guests.loading') }}</p>
        <p v-else-if="guests.length === 0">{{ t('guests.empty') }}</p>

        <GuestsList v-else :guests="guests" v-model="viewMode" />
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

.guests-page {
  padding: 0.5rem;
}

.guests-card {
  width: 100%;
}

.guests-page :deep(.p-card-body) {
  width: 100%;
}


</style>
