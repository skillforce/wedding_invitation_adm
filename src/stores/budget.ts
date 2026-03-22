import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { BudgetCurrency, BudgetDto, BudgetItem, BudgetRow, BudgetSection, BudgetTotals, Priority } from '@/types/budget'
import { BUDGET_API } from '@/api/budget'
import { useAppCommonStore } from '@/stores/app_common'

const PRIORITY_CYCLE: Priority[] = ['must', 'want', 'maybe']
const COLLAPSED_STORAGE_KEY = 'wedly_budget_collapsed'

function loadCollapsed(): Set<number> {
  try {
    const raw = localStorage.getItem(COLLAPSED_STORAGE_KEY)
    if (raw) return new Set<number>(JSON.parse(raw))
  } catch {}
  return new Set()
}

function saveCollapsed(ids: Set<number>): void {
  localStorage.setItem(COLLAPSED_STORAGE_KEY, JSON.stringify([...ids]))
}

function flattenBudget(dto: BudgetDto, collapsedIds: Set<number>): BudgetRow[] {
  const rows: BudgetRow[] = []
  for (const section of dto.sections) {
    rows.push({
      id: section.id,
      type: 'section',
      name: section.name,
      collapsed: collapsedIds.has(section.id),
    })
    for (const item of section.items) {
      rows.push({
        id: item.id,
        type: 'item',
        sectionId: section.id,
        name: item.name,
        estimatedCost: item.estimatedCost,
        actualCost: item.actualCost,
        deposit: item.deposit ?? null,
        priority: item.priority,
        paid: item.paid,
      })
    }
  }
  return rows
}

export const useBudgetStore = defineStore('budget', () => {
  const rows = ref<BudgetRow[]>([])
  const budgetLimit = ref<number>(0)
  const currency = ref<BudgetCurrency>('BYN')
  const collapsedSections = loadCollapsed()

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

  function applyBudget(dto: BudgetDto): void {
    budgetLimit.value = dto.budgetLimit
    currency.value = dto.currency
    rows.value = flattenBudget(dto, collapsedSections)
  }

  async function fetchBudget(): Promise<void> {
    const appCommon = useAppCommonStore()
    appCommon.showSpinner()
    try {
      const dto = await BUDGET_API.getBudget()
      applyBudget(dto)
    } catch {
      appCommon.showError(new Error('errors.budget.failedToLoad'))
    } finally {
      appCommon.hideSpinner()
    }
  }

  async function setBudgetLimit(limit: number): Promise<void> {
    if (limit === budgetLimit.value) return
    const appCommon = useAppCommonStore()
    try {
      const dto = await BUDGET_API.patchBudget({ budgetLimit: limit })
      applyBudget(dto)
    } catch {
      appCommon.showError(new Error('errors.budget.failedToUpdate'))
    }
  }

  async function setCurrency(c: BudgetCurrency): Promise<void> {
    if (c === currency.value) return
    const appCommon = useAppCommonStore()
    try {
      const dto = await BUDGET_API.patchBudget({ currency: c })
      applyBudget(dto)
    } catch {
      appCommon.showError(new Error('errors.budget.failedToUpdate'))
    }
  }

  async function addSection(name: string): Promise<void> {
    const appCommon = useAppCommonStore()
    try {
      const dto = await BUDGET_API.createSection({ name })
      applyBudget(dto)
    } catch {
      appCommon.showError(new Error('errors.budget.failedToCreateSection'))
    }
  }

  async function updateSection(id: number, changes: Partial<BudgetSection>): Promise<void> {
    const current = rows.value.find((r) => r.id === id && r.type === 'section') as BudgetSection | undefined
    if (current && changes.name !== undefined && changes.name === current.name) return
    const appCommon = useAppCommonStore()
    try {
      const dto = await BUDGET_API.patchSection(id, { name: changes.name })
      applyBudget(dto)
    } catch {
      appCommon.showError(new Error('errors.budget.failedToUpdateSection'))
    }
  }

  async function deleteSection(id: number): Promise<void> {
    const appCommon = useAppCommonStore()
    try {
      await BUDGET_API.deleteSection(id)
      collapsedSections.delete(id)
      saveCollapsed(collapsedSections)
      rows.value = rows.value.filter((r) => !(r.id === id || (r.type === 'item' && r.sectionId === id)))
    } catch {
      appCommon.showError(new Error('errors.budget.failedToDeleteSection'))
    }
  }

  function toggleCollapse(sectionId: number): void {
    if (collapsedSections.has(sectionId)) {
      collapsedSections.delete(sectionId)
    } else {
      collapsedSections.add(sectionId)
    }
    saveCollapsed(collapsedSections)

    const section = rows.value.find((r) => r.id === sectionId)
    if (section && section.type === 'section') {
      section.collapsed = collapsedSections.has(sectionId)
    }
  }

  async function addItem(sectionId: number, name = ''): Promise<void> {
    const appCommon = useAppCommonStore()
    try {
      const dto = await BUDGET_API.createItem({ sectionId, name })
      collapsedSections.delete(sectionId)
      saveCollapsed(collapsedSections)
      applyBudget(dto)
    } catch {
      appCommon.showError(new Error('errors.budget.failedToCreateItem'))
    }
  }

  async function updateItem(id: number, changes: Partial<BudgetItem>): Promise<void> {
    const current = rows.value.find((r) => r.id === id && r.type === 'item') as BudgetItem | undefined
    if (current) {
      const keys = Object.keys(changes) as (keyof BudgetItem)[]
      const allSame = keys.every((k) => changes[k] === current[k])
      if (allSame) return
    }
    const appCommon = useAppCommonStore()
    try {
      await BUDGET_API.patchItem(id, {
        name: changes.name,
        estimatedCost: changes.estimatedCost,
        actualCost: changes.actualCost,
        deposit: changes.deposit,
        priority: changes.priority,
        paid: changes.paid,
      })

      if (!current) return

      if (changes.name !== undefined) current.name = changes.name
      if (changes.estimatedCost !== undefined) current.estimatedCost = changes.estimatedCost
      if (changes.actualCost !== undefined) current.actualCost = changes.actualCost
      if (changes.deposit !== undefined) current.deposit = changes.deposit
      if (changes.priority !== undefined) current.priority = changes.priority
      if (changes.paid !== undefined) current.paid = changes.paid
    } catch {
      appCommon.showError(new Error('errors.budget.failedToUpdateItem'))
    }
  }

  async function deleteItem(id: number): Promise<void> {
    const appCommon = useAppCommonStore()
    try {
      await BUDGET_API.deleteItem(id)
      rows.value = rows.value.filter((r) => r.id !== id)
    } catch {
      appCommon.showError(new Error('errors.budget.failedToDeleteItem'))
    }
  }

  async function cyclePriority(id: number): Promise<void> {
    const item = rows.value.find((r) => r.id === id)
    if (!item || item.type !== 'item') return
    const currentIdx = PRIORITY_CYCLE.indexOf(item.priority)
    const nextPriority = PRIORITY_CYCLE[(currentIdx + 1) % PRIORITY_CYCLE.length]
    if (nextPriority) {
      await updateItem(id, { priority: nextPriority })
    }
  }

  const totals = computed<BudgetTotals>(() => {
    const items = rows.value.filter((r): r is BudgetItem => r.type === 'item')

    const planned = items.reduce((sum, i) => sum + i.estimatedCost, 0)
    const deposit = items.reduce((sum, i) => sum + (i.deposit ?? 0), 0)
    const paidWithoutDeposit = items.reduce((sum, item) => {
      if (typeof item.actualCost === 'number') {
        return sum + item.actualCost
      }
      if (item.paid) {
        return sum + item.estimatedCost
      }
      return sum
    }, 0)

    const paid = paidWithoutDeposit + deposit
    const remaining = planned - paid

    const byPriority = {
      must: items.filter((i) => i.priority === 'must').reduce((sum, i) => sum + i.estimatedCost, 0),
      want: items.filter((i) => i.priority === 'want').reduce((sum, i) => sum + i.estimatedCost, 0),
      maybe: items.filter((i) => i.priority === 'maybe').reduce((sum, i) => sum + i.estimatedCost, 0),
    }

    const percentUsed = budgetLimit.value > 0 ? Math.round((planned / budgetLimit.value) * 100) : 0

    const itemsWithActual = items.filter((i) => typeof i.actualCost === 'number')
    const deviationEstimated = itemsWithActual.reduce((sum, i) => sum + i.estimatedCost, 0)
    const deviationActual = itemsWithActual.reduce((sum, i) => sum + (i.actualCost ?? 0) + (i.deposit ?? 0), 0)

    return { planned, paid, deposit, remaining, byPriority, percentUsed, deviationEstimated, deviationActual }
  })

  function getSectionTotal(sectionId: number): number {
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
    fetchBudget,
    addSection,
    updateSection,
    deleteSection,
    toggleCollapse,
    addItem,
    updateItem,
    deleteItem,
    cyclePriority,
    setBudgetLimit,
    setCurrency,
    getSectionTotal,
  }
})
