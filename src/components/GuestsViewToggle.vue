<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'

const viewMode = defineModel<'grid' | 'list'>({ required: true })
const { t } = useI18n()
</script>

<template>
  <div class="view-toggle">
    <Button
      icon="pi pi-list"
      :severity="viewMode === 'list' ? 'primary' : 'secondary'"
      :aria-label="t('guests.listView')"
      size="small"
      text
      rounded
      @click="viewMode = 'list'"
    />
    <Button
      icon="pi pi-th-large"
      :severity="viewMode === 'grid' ? 'primary' : 'secondary'"
      :aria-label="t('guests.gridView')"
      size="small"
      text
      rounded
      @click="viewMode = 'grid'"
    />
  </div>
</template>

<style scoped>
.view-toggle {
  display: flex;
  gap: 0.25rem;
}
</style>