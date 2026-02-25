<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import { useSeatingStore } from '@/stores/seating'

defineProps<{ isFitted: boolean }>()
const emit = defineEmits<{ addTable: []; exportPdf: []; fitCanvas: [] }>()
const seatingStore = useSeatingStore()
const { t } = useI18n()

function exportData() {
  const divider = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
  const lines: string[] = []
  lines.push(`💒 ${t('seating.exportTitle')}`)
  lines.push(divider)
  lines.push('')
  const totalGuests = seatingStore.tables.reduce((sum, t) => sum + t.guests.length, 0)
  const totalTables = seatingStore.tables.length
  lines.push(`📊 ${t('seating.exportSummary', { tables: totalTables, guests: totalGuests })}`)
  lines.push(divider)
  lines.push('')
  for (const table of seatingStore.tables) {
    const tableIcon = table.shape === 'rect' ? '👑' : '🪑'
    lines.push(`${tableIcon} ${table.name}`)
    if (table.guests.length === 0) {
      lines.push(`   - ${t('seating.exportNoGuests')}`)
    } else {
      lines.push(`   👥 ${t('seating.exportGuestCount', { count: table.guests.length })}`)
      table.guests.forEach((guest, idx) => {
        lines.push(`   ${idx + 1}. ${guest.name}`)
      })
    }
    lines.push(divider)
    lines.push('')
  }
  const content = lines.join('\n')
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = t('seating.textFileName')
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="board-toolbar">
    <Button :label="t('seating.addTable')" icon="pi pi-plus" size="small" @click="emit('addTable')" />
    <Button :label="t('seating.workspace')" icon="pi pi-expand" size="small" :disabled="isFitted" @click="emit('fitCanvas')" />
    <Button :label="t('seating.exportData')" icon="pi pi-download" size="small" severity="secondary" @click="exportData" />
    <Button :label="t('seating.savePdf')" icon="pi pi-file-pdf" size="small" severity="secondary" @click="emit('exportPdf')" />
  </div>
</template>

<style scoped>


.board-toolbar {
  position: absolute;
  top: 14px;
  left: 16px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--board-toolbar-bg);
  backdrop-filter: blur(8px);
  border: 1px solid var(--board-toolbar-border);
  border-radius: 10px;
  padding: 8px 14px;
}

@media (max-width: 639px) {
  .board-toolbar {
    display: none;
  }
}
</style>
