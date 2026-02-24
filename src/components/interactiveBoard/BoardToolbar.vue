<script setup lang="ts">
import Button from 'primevue/button'
import { useSeatingStore } from '@/stores/seating'

const emit = defineEmits<{ addTable: []; exportPdf: [] }>()
const seatingStore = useSeatingStore()

function exportData() {
  const divider = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
  const lines: string[] = []
  lines.push('💒 Рассадка гостей')
  lines.push(divider)
  lines.push('')
  const totalGuests = seatingStore.tables.reduce((sum, t) => sum + t.guests.length, 0)
  const totalTables = seatingStore.tables.length
  lines.push(`📊 Всего столов: ${totalTables}   |   🎉 Всего гостей: ${totalGuests}`)
  lines.push(divider)
  lines.push('')
  for (const table of seatingStore.tables) {
    const tableIcon = table.shape === 'rect' ? '👑' : '🪑'
    lines.push(`${tableIcon} ${table.name}`)
    if (table.guests.length === 0) {
      lines.push('   — нет гостей')
    } else {
      lines.push(`   👥 Гостей: ${table.guests.length}`)
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
  a.download = 'рассадка.txt'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="board-toolbar">
    <Button label="Добавить стол" icon="pi pi-plus" size="small" @click="emit('addTable')" />
    <Button label="Выгрузить данные" icon="pi pi-download" size="small" severity="secondary" @click="exportData" />
    <Button label="Сохранить PDF" icon="pi pi-file-pdf" size="small" severity="secondary" @click="emit('exportPdf')" />
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

.board-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--board-toolbar-text);
  letter-spacing: 0.03em;
  white-space: nowrap;
}
</style>
