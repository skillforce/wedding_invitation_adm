import { useI18n } from 'vue-i18n'
import { useSeatingStore } from '@/stores/seating'

export function useExportData() {
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

  return { exportData }
}