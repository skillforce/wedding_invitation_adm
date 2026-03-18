<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'

defineProps<{
  hasActiveFilters: boolean
}>()

defineEmits<{
  toggle: [event: MouseEvent]
  clear: []
}>()

const { t } = useI18n()
</script>

<template>
  <div class="filter-controls">
    <Button
      :icon="hasActiveFilters ? 'pi pi-filter-fill' : 'pi pi-filter'"
      :label="t('guests.filtersButton')"
      :severity="hasActiveFilters ? 'contrast' : 'secondary'"
      outlined
      size="small"
      @click="$emit('toggle', $event)"
    />
    <Button
      icon="pi pi-times"
      :label="t('guests.clearFiltersButton')"
      severity="danger"
      outlined
      size="small"
      :disabled="!hasActiveFilters"
      @click="$emit('clear')"
    />
  </div>
</template>

<style scoped>
.filter-controls {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
}
</style>
