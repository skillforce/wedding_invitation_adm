<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import AddNameDialog from './AddNameDialog.vue'

const { t } = useI18n()

const dialogRef = ref<InstanceType<typeof AddNameDialog> | null>(null)
</script>

<template>
  <Button
    :label="t('budget.addSection')"
    icon="pi pi-folder-open"
    severity="primary"
    class="add-section-btn"
    @click="dialogRef?.open()"
  />
  <AddNameDialog ref="dialogRef" mode="section" />
</template>

<style scoped>
/* On mobile: hide the label, show icon only */
@media (max-width: 767px) {
  .add-section-btn :deep(.p-button-label) {
    display: none;
  }
  .add-section-btn :deep(.p-button-icon) {
    margin: 0;
  }
}
</style>
