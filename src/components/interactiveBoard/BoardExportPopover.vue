<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Popover from 'primevue/popover'
import Button from 'primevue/button'
import type { Stage } from 'konva/lib/Stage'
import BottomDrawer from '@/components/shared/BottomDrawer.vue'
import ExportPdf from '@/components/interactiveBoard/ExportPdf.vue'
import { useExportData } from '@/components/interactiveBoard/composables/useExportData'

defineProps<{
  stageRef: { getNode(): Stage } | null
}>()

const { t } = useI18n()
const { exportData } = useExportData()

const popoverRef = ref<InstanceType<typeof Popover> | null>(null)
const isDrawerOpen = ref(false)
const isMobile = ref(false)

function syncViewportMode() {
  if (typeof window === 'undefined') return
  isMobile.value = window.innerWidth < 640
}

function toggle(event: MouseEvent) {
  if (isMobile.value) {
    isDrawerOpen.value = !isDrawerOpen.value
    return
  }
  popoverRef.value?.toggle(event)
}

function hide() {
  popoverRef.value?.hide()
  isDrawerOpen.value = false
}

function onExportData() {
  exportData()
  hide()
}

onMounted(() => {
  syncViewportMode()
  window.addEventListener('resize', syncViewportMode)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncViewportMode)
})
</script>

<template>
  <Button
    :aria-label="t('seating.exportData')"
    icon="pi pi-download"
    size="small"
    severity="secondary"
    @click="toggle"
  />

  <Popover ref="popoverRef">
    <div class="export-panel">
      <Button
        :label="t('seating.exportData')"
        icon="pi pi-download"
        size="small"
        severity="secondary"
        @click="onExportData"
      />
      <ExportPdf :stage-ref="stageRef">
        <template #default="{ onClick }">
          <Button
            :label="t('seating.savePdf')"
            icon="pi pi-file-pdf"
            size="small"
            severity="secondary"
            @click="() => { onClick(); hide() }"
          />
        </template>
      </ExportPdf>
    </div>
  </Popover>

  <BottomDrawer :open="isDrawerOpen" @close="hide">
    <div class="export-panel">
      <Button
        :label="t('seating.exportData')"
        icon="pi pi-download"
        size="small"
        severity="secondary"
        @click="onExportData"
      />
      <ExportPdf :stage-ref="stageRef">
        <template #default="{ onClick }">
          <Button
            :label="t('seating.savePdf')"
            icon="pi pi-file-pdf"
            size="small"
            severity="secondary"
            @click="() => { onClick(); hide() }"
          />
        </template>
      </ExportPdf>
    </div>
  </BottomDrawer>
</template>

<style scoped>
.export-panel {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.25rem 0;
}
</style>
