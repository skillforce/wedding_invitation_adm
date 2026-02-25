<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { GuestsViewDto } from '@/api/guests'
import GuestListItem from '@/components/GuestListItem.vue'
import GuestsViewToggle from '@/components/GuestsViewToggle.vue'

defineProps<{
  guests: GuestsViewDto[]
}>()

const viewMode = defineModel<'grid' | 'list'>({ required: true })
const { t } = useI18n()
</script>

<template>
  <section class="guests-section">
    <div class="guests-title">{{ t('guests.respondedTitle') }}</div>
    <GuestsViewToggle v-model="viewMode" class="guests-toggle" />
    <div :class="['guests-items', viewMode === 'grid' ? 'items-grid' : 'items-list']">
      <GuestListItem
        v-for="guest in guests"
        :key="guest.id"
        :guest="guest"
        :view-mode="viewMode"
      />
    </div>
  </section>
</template>

<style scoped>
.guests-section {
  margin-top: 1rem;
}

.guests-title {
  margin-left: 0.75rem;
  font-size: 1.25rem;
  color: var(--color-title);
}

.guests-toggle {
  margin-left: 0.25rem;
  margin-bottom: 0.75rem;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.75rem;
}

.items-list {
  display: grid;
  gap: 0.75rem;
}
</style>