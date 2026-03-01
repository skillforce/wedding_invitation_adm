import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { BudgetCurrency, BudgetItem, BudgetRow, BudgetSection, BudgetTotals, Priority } from '@/types/budget'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const PRIORITY_CYCLE: Priority[] = ['must', 'want', 'maybe']

const DEFAULT_ROWS: BudgetRow[] = [
  { id: 'section-1', type: 'section', name: 'Организация' },
  {
    id: 'item-1',
    type: 'item',
    sectionId: 'section-1',
    name: 'Ведущий',
    estimatedCost: 50000,
    actualCost: null,
    priority: 'must',
    paid: false,
  },
  { id: 'section-2', type: 'section', name: 'Банкет' },
  {
    id: 'item-2',
    type: 'item',
    sectionId: 'section-2',
    name: 'Аренда зала',
    estimatedCost: 150000,
    actualCost: null,
    priority: 'must',
    paid: false,
  },
]

export const useBudgetStore = defineStore(
  'budget',
  () => {
    const rows = ref<BudgetRow[]>(DEFAULT_ROWS)
    const budgetLimit = ref<number>(500000)
    const currency = ref<BudgetCurrency>('RUB')
    const pendingFocusItemId = ref<string | null>(null)

    const CURRENCY_SYMBOLS: Record<BudgetCurrency, string> = {
      RUB: '₽',
      USD: '$',
      BYN: 'BYN',
    }

    function formatCurrency(val: number): string {
      const sym = CURRENCY_SYMBOLS[currency.value]
      const formatted = val.toLocaleString('ru-RU')
      return currency.value === 'USD' ? `${sym}${formatted}` : `${formatted} ${sym}`
    }

    function setCurrency(c: BudgetCurrency): void {
      currency.value = c
    }

    // ─── Section CRUD ───────────────────────────────────────────────

    function addSection(name: string): void {
      rows.value.push({ id: generateId(), type: 'section', name, collapsed: false })
    }

    function updateSection(id: string, changes: Partial<BudgetSection>): void {
      const idx = rows.value.findIndex((r) => r.id === id)
      if (idx !== -1) {
        rows.value[idx] = { ...rows.value[idx], ...changes } as BudgetSection
      }
    }

    function deleteSection(id: string): void {
      rows.value = rows.value.filter((r) => !(r.id === id || (r.type === 'item' && r.sectionId === id)))
    }

    function toggleCollapse(sectionId: string): void {
      const section = rows.value.find((r) => r.id === sectionId)
      if (section && section.type === 'section') {
        section.collapsed = !section.collapsed
      }
    }

    // ─── Item CRUD ──────────────────────────────────────────────────

    function addItem(sectionId: string, name = ''): void {
      const sectionIdx = rows.value.findIndex((r) => r.id === sectionId)
      if (sectionIdx === -1) return

      const newItem: BudgetItem = {
        id: generateId(),
        type: 'item',
        sectionId,
        name,
        estimatedCost: 0,
        actualCost: null,
        priority: 'must',
        paid: false,
      }

      // Insert after the last item of this section
      let insertAt = sectionIdx + 1
      for (let i = sectionIdx + 1; i < rows.value.length; i++) {
        const row = rows.value[i]!
        if (row.type === 'item' && (row as BudgetItem).sectionId === sectionId) {
          insertAt = i + 1
        } else if (row.type === 'section') {
          break
        }
      }
      // Uncollapse the section so the new item is visible
      const section = rows.value[sectionIdx] as BudgetSection
      if (section.collapsed) {
        rows.value[sectionIdx] = { ...section, collapsed: false }
      }

      rows.value.splice(insertAt, 0, newItem)
      if (!name) pendingFocusItemId.value = newItem.id
    }

    function updateItem(id: string, changes: Partial<BudgetItem>): void {
      const idx = rows.value.findIndex((r) => r.id === id)
      if (idx !== -1) {
        rows.value[idx] = { ...rows.value[idx], ...changes } as BudgetItem
      }
    }

    function deleteItem(id: string): void {
      rows.value = rows.value.filter((r) => r.id !== id)
    }

    function cyclePriority(id: string): void {
      const item = rows.value.find((r) => r.id === id)
      if (!item || item.type !== 'item') return
      const currentIdx = PRIORITY_CYCLE.indexOf(item.priority)
      const nextPriority = PRIORITY_CYCLE[(currentIdx + 1) % PRIORITY_CYCLE.length]
      if (nextPriority) item.priority = nextPriority
    }

    function setBudgetLimit(limit: number): void {
      budgetLimit.value = limit
    }

    // ─── Computed totals ────────────────────────────────────────────

    const totals = computed<BudgetTotals>(() => {
      const items = rows.value.filter((r): r is BudgetItem => r.type === 'item')

      const planned = items.reduce((sum, i) => sum + i.estimatedCost, 0)
      const paid = items.reduce((sum, item) => {
        if (typeof item.actualCost === 'number') {
          return sum + item.actualCost
        }

        if (item.paid) {
          return sum + item.estimatedCost
        }

        return sum
      }, 0)
      const remaining = budgetLimit.value - paid

      const byPriority = {
        must: items.filter((i) => i.priority === 'must').reduce((sum, i) => sum + i.estimatedCost, 0),
        want: items.filter((i) => i.priority === 'want').reduce((sum, i) => sum + i.estimatedCost, 0),
        maybe: items.filter((i) => i.priority === 'maybe').reduce((sum, i) => sum + i.estimatedCost, 0),
      }

      const percentUsed = budgetLimit.value > 0 ? Math.round((planned / budgetLimit.value) * 100) : 0

      return { planned, paid, remaining, byPriority, percentUsed }
    })

    function getSectionTotal(sectionId: string): number {
      return rows.value
        .filter((r): r is BudgetItem => r.type === 'item' && r.sectionId === sectionId)
        .reduce((sum, i) => sum + i.estimatedCost, 0)
    }

    return {
      rows,
      budgetLimit,
      currency,
      totals,
      formatCurrency,
      addSection,
      updateSection,
      deleteSection,
      toggleCollapse,
      pendingFocusItemId,
      addItem,
      updateItem,
      deleteItem,
      cyclePriority,
      setBudgetLimit,
      setCurrency,
      getSectionTotal,
    }
  },
  {
    persist: {
      key: 'wedly_budget',
    },
  },
)
