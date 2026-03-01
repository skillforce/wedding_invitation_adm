<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import { useBudgetStore } from '@/stores/budget'
import { useI18n } from 'vue-i18n'
import type { BudgetItem, BudgetSection } from '@/types/budget'

const store = useBudgetStore()
const { t, locale } = useI18n()

const loading = ref(false)

type SheetRow = (string | number | null)[]

async function exportExcel() {
  loading.value = true
  try {
    const { utils, writeFile } = await import('xlsx')

    const PRIORITY_LABELS: Record<string, string> = {
      must: t('budget.priority.must'),
      want: t('budget.priority.want'),
      maybe: t('budget.priority.maybe'),
    }

    // Columns: Name | Estimated | Actual | Deviation | Priority | Paid
    const headers: SheetRow = [
      t('budget.name'),
      t('budget.estimated'),
      t('budget.actual'),
      t('budget.export.deviation'),
      t('budget.priorityColumn'),
      t('budget.paid'),
    ]

    const sheetRows: SheetRow[] = [headers]

    // Group items by section for subtotals
    let currentSection: BudgetSection | null = null
    let sectionItems: BudgetItem[] = []

    function flushSection() {
      if (!currentSection) return

      const subtotalEst = sectionItems.reduce((s, i) => s + i.estimatedCost, 0)
      const subtotalAct = sectionItems.reduce((s, i) => {
        const a = i.actualCost ?? (i.paid ? i.estimatedCost : null)
        return a !== null ? s + a : s
      }, 0)

      // Section header row
      sheetRows.push([`▶  ${currentSection.name.toUpperCase()}`, subtotalEst, subtotalAct || null, null, '', ''])

      // Item rows (indented)
      for (const item of sectionItems) {
        const actual = item.actualCost ?? (item.paid ? item.estimatedCost : null)
        const deviation = actual !== null ? actual - item.estimatedCost : null
        sheetRows.push([
          `    ${item.name}`,
          item.estimatedCost,
          actual,
          deviation,
          PRIORITY_LABELS[item.priority] ?? item.priority,
          item.paid ? t('budget.export.yes') : t('budget.export.no'),
        ])
      }

      // Section subtotal row
      if (sectionItems.length > 1) {
        sheetRows.push([
          `  ${t('budget.export.subtotal')}`,
          subtotalEst,
          subtotalAct || null,
          subtotalAct ? subtotalAct - subtotalEst : null,
          '',
          '',
        ])
      }

      sheetRows.push(['', null, null, null, '', ''])
    }

    for (const row of store.rows) {
      if (row.type === 'section') {
        flushSection()
        currentSection = row as BudgetSection
        sectionItems = []
      } else {
        sectionItems.push(row as BudgetItem)
      }
    }
    flushSection()

    // Grand total row
    const { totals } = store
    sheetRows.push([
      t('budget.export.total').toUpperCase(),
      totals.planned,
      totals.paid,
      totals.paid - totals.planned,
      '',
      '',
    ])

    const ws = utils.aoa_to_sheet(sheetRows)

    ws['!cols'] = [
      { wch: 36 },
      { wch: 16 },
      { wch: 16 },
      { wch: 16 },
      { wch: 14 },
      { wch: 10 },
    ]

    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, t('budget.title'))

    const fileName = locale.value === 'ru' ? 'бюджет.xlsx' : 'budget.xlsx'
    writeFile(wb, fileName)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Button
    :label="t('budget.export.button')"
    icon="pi pi-file-excel"
    severity="secondary"
    outlined
    :loading="loading"
    @click="exportExcel"
  />
</template>