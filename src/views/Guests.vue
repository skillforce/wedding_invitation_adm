<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import { useGuestsStore } from '@/stores/guests'
import GuestsList from '@/components/GuestsList.vue'
import GuestsManageList from '@/components/GuestsManageList.vue'

const guestsStore = useGuestsStore()
const guests = computed(() => guestsStore.guests)
const respondedGuests = computed(() => guests.value.filter((g) => g.is_already_answered))
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
    <Card class="guests-card" >
      <template #title>{{ t('guests.title') }}</template>
      <template #content >
        <p v-if="guestsStore.isLoading">{{ t('guests.loading') }}</p>
        <Tabs v-else v-model:value="guestsStore.activeTab">
          <TabList>
            <Tab value="manage">{{ t('guests.tabs.manage') }}</Tab>
            <Tab value="responses">{{ t('guests.tabs.responses') }}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="manage">
              <GuestsManageList
                :guests="guests"
                :is-adding="guestsStore.isAdding"
                @add="guestsStore.addGuest"
                @remove="guestsStore.removeGuest"
              />
            </TabPanel>
            <TabPanel value="responses">
              <p v-if="respondedGuests.length === 0">{{ t('guests.empty') }}</p>
              <GuestsList v-else :guests="respondedGuests" v-model="viewMode" />
            </TabPanel>
          </TabPanels>
        </Tabs>
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

.guests-page :deep(.p-tabs) {
  border-radius: 12px;
  overflow: hidden;
}

.guests-page :deep(.p-card-body) {
  width: 100%;
}

@media (max-width: 480px) {
  .guests-page :deep(.p-tab) {
    padding: 0.5rem 0.75rem;
  }

  .guests-page :deep(.p-card-body) {
    padding: 0.75rem;
  }
}
</style>
