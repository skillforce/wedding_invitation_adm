import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { BudgetRowType } from '@/types/budget'
import type {
  BudgetCurrency,
  BudgetDto,
  BudgetItem,
  BudgetItemDto,
  BudgetRow,
  BudgetSection,
  BudgetSectionDto,
  BudgetTotals,
  CurrencyBreakdown,
  MultiCurrencyTotals,
  Priority,
} from '@/types/budget'
import { BUDGET_API } from '@/api/budget'
import { useAppCommonStore } from '@/stores/app_common'
import { useCurrencyStore } from '@/stores/currency'
import { useSelectedUser } from '@/composables/useSelectedUser'

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

interface BudgetSectionState extends BudgetSection {
  items: BudgetItem[]
}

function sortByOrder<T extends { sortOrder: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder)
}

function mapItem(sectionId: number, item: BudgetItemDto): BudgetItem {
  return {
    id: item.id,
    type: BudgetRowType.Item,
    sectionId,
    name: item.name,
    currency: item.currency,
    sortOrder: item.sortOrder,
    estimatedCost: item.estimatedCost,
    actualCost: item.actualCost,
    deposit: item.deposit ?? null,
    priority: item.priority,
    paid: item.paid,
  }
}

function mapSection(section: BudgetSectionDto, collapsedIds: Set<number>, collapsed = collapsedIds.has(section.id)): BudgetSectionState {
  return {
    id: section.id,
    type: BudgetRowType.Section,
    name: section.name,
    sortOrder: section.sortOrder,
    collapsed,
    items: sortByOrder(section.items).map((item) => mapItem(section.id, item)),
  }
}

function cloneSections(sections: BudgetSectionState[]): BudgetSectionState[] {
  return sections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({ ...item })),
  }))
}

function flattenSections(sections: BudgetSectionState[]): BudgetRow[] {
  const rows: BudgetRow[] = []
  for (const section of sortByOrder(sections)) {
    rows.push({
      id: section.id,
      type: BudgetRowType.Section,
      name: section.name,
      sortOrder: section.sortOrder,
      collapsed: section.collapsed,
    })
    for (const item of sortByOrder(section.items)) {
      rows.push(item)
    }
  }
  return rows
}

export const useBudgetStore = defineStore('budget', () => {
  const { selectedUserId } = useSelectedUser()

  const sections = ref<BudgetSectionState[]>([])
  const budgetLimit = ref<number>(0)
  const currency = ref<BudgetCurrency>('BYN')
  const collapsedSections = loadCollapsed()
  const rows = computed<BudgetRow[]>(() => flattenSections(sections.value))

  const CURRENCY_SYMBOLS: Record<BudgetCurrency, string> = {
    RUB: '₽',
    USD: '$',
    BYN: 'BYN',
  }

  function formatCurrencyAmount(val: number, valueCurrency: BudgetCurrency): string {
    const sym = CURRENCY_SYMBOLS[valueCurrency]
    const formatted = val.toLocaleString('ru-RU')
    return valueCurrency === 'USD' ? `${sym}${formatted}` : `${formatted} ${sym}`
  }

  function formatCurrency(val: number): string {
    return formatCurrencyAmount(val, currency.value)
  }

  function applyBudget(dto: BudgetDto): void {
    budgetLimit.value = dto.budgetLimit
    currency.value = dto.currency
    sections.value = sortByOrder(dto.sections).map((section) => mapSection(section, collapsedSections))
  }

  function applyMovedSections(updatedSections: BudgetSectionDto[]): void {
    const nextSections = cloneSections(sections.value)

    for (const updatedSection of updatedSections) {
      const sectionIndex = nextSections.findIndex((section) => section.id === updatedSection.id)
      const collapsed = sectionIndex === -1
        ? collapsedSections.has(updatedSection.id)
        : nextSections[sectionIndex]?.collapsed

      const mappedSection = mapSection(
        updatedSection,
        collapsedSections,
        collapsed ?? collapsedSections.has(updatedSection.id),
      )

      if (sectionIndex === -1) {
        nextSections.push(mappedSection)
      } else {
        nextSections[sectionIndex] = mappedSection
      }
    }

    sections.value = sortByOrder(nextSections).map((section) => ({
      ...section,
      items: sortByOrder(section.items),
    }))
  }

  function findSection(sectionId: number): BudgetSectionState | undefined {
    return sections.value.find((section) => section.id === sectionId)
  }

  function findItem(itemId: number): { section: BudgetSectionState; index: number; item: BudgetItem } | undefined {
    for (const section of sections.value) {
      const index = section.items.findIndex((item) => item.id === itemId)
      if (index !== -1) {
        const item = section.items[index]
        if (item) {
          return { section, index, item }
        }
      }
    }
  }

  function reindexSectionOrders(items: BudgetSectionState[]): void {
    items.forEach((section, index) => {
      section.sortOrder = index
    })
  }

  function reindexItemOrders(section: BudgetSectionState): void {
    section.items.forEach((item, index) => {
      item.sectionId = section.id
      item.sortOrder = index
    })
  }

  async function fetchBudget(userId?: number): Promise<void> {
    const appCommon = useAppCommonStore()
    appCommon.showSpinner()
    try {
      const dto = await BUDGET_API.getBudget(userId)
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
      const dto = await BUDGET_API.patchBudget({ budgetLimit: limit }, selectedUserId.value ?? undefined)
      applyBudget(dto)
    } catch {
      appCommon.showError(new Error('errors.budget.failedToUpdate'))
    }
  }

  async function setCurrency(c: BudgetCurrency): Promise<void> {
    if (c === currency.value) return
    const appCommon = useAppCommonStore()
    try {
      const dto = await BUDGET_API.patchBudget({ currency: c }, selectedUserId.value ?? undefined)
      applyBudget(dto)
    } catch {
      appCommon.showError(new Error('errors.budget.failedToUpdate'))
    }
  }

  async function addSection(name: string): Promise<void> {
    const appCommon = useAppCommonStore()
    try {
      const dto = await BUDGET_API.createSection({ name }, selectedUserId.value ?? undefined)
      applyBudget(dto)
    } catch {
      appCommon.showError(new Error('errors.budget.failedToCreateSection'))
    }
  }

  async function updateSection(id: number, changes: Partial<BudgetSection>): Promise<void> {
    const current = findSection(id)
    if (current && changes.name !== undefined && changes.name === current.name) return
    const appCommon = useAppCommonStore()
    try {
      const dto = await BUDGET_API.patchSection(id, { name: changes.name }, selectedUserId.value ?? undefined)
      applyBudget(dto)
    } catch {
      appCommon.showError(new Error('errors.budget.failedToUpdateSection'))
    }
  }

  async function deleteSection(id: number): Promise<void> {
    const appCommon = useAppCommonStore()
    try {
      await BUDGET_API.deleteSection(id, selectedUserId.value ?? undefined)
      collapsedSections.delete(id)
      saveCollapsed(collapsedSections)
      sections.value = sections.value.filter((section) => section.id !== id)
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

    const section = findSection(sectionId)
    if (section) {
      section.collapsed = collapsedSections.has(sectionId)
    }
  }

  function expandSection(sectionId: number): void {
    if (!collapsedSections.has(sectionId)) return

    collapsedSections.delete(sectionId)
    saveCollapsed(collapsedSections)

    const section = findSection(sectionId)
    if (section) {
      section.collapsed = false
    }
  }

  async function addItem(sectionId: number, name = ''): Promise<void> {
    const appCommon = useAppCommonStore()
    try {
      const dto = await BUDGET_API.createItem({ sectionId, name, currency: currency.value }, selectedUserId.value ?? undefined)
      collapsedSections.delete(sectionId)
      saveCollapsed(collapsedSections)
      applyBudget(dto)
    } catch {
      appCommon.showError(new Error('errors.budget.failedToCreateItem'))
    }
  }

  async function updateItem(id: number, changes: Partial<BudgetItem>): Promise<void> {
    const current = findItem(id)?.item
    if (current) {
      const keys = Object.keys(changes) as (keyof BudgetItem)[]
      const allSame = keys.every((k) => changes[k] === current[k])
      if (allSame) return
    }
    const appCommon = useAppCommonStore()
    try {
      await BUDGET_API.patchItem(id, {
        name: changes.name,
        currency: changes.currency,
        estimatedCost: changes.estimatedCost,
        actualCost: changes.actualCost,
        deposit: changes.deposit,
        priority: changes.priority,
        paid: changes.paid,
      }, selectedUserId.value ?? undefined)

      if (!current) return

      if (changes.name !== undefined) current.name = changes.name
      if (changes.currency !== undefined) current.currency = changes.currency
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
      await BUDGET_API.deleteItem(id, selectedUserId.value ?? undefined)
      const location = findItem(id)
      if (location) {
        location.section.items.splice(location.index, 1)
        reindexItemOrders(location.section)
      }
    } catch {
      appCommon.showError(new Error('errors.budget.failedToDeleteItem'))
    }
  }

  async function cyclePriority(id: number): Promise<void> {
    const item = findItem(id)?.item
    if (!item) return
    const currentIdx = PRIORITY_CYCLE.indexOf(item.priority)
    const nextPriority = PRIORITY_CYCLE[(currentIdx + 1) % PRIORITY_CYCLE.length]
    if (nextPriority) {
      await updateItem(id, { priority: nextPriority })
    }
  }

  async function moveSection(fromIndex: number, toIndex: number): Promise<void> {
    if (fromIndex === toIndex) return
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= sections.value.length || toIndex >= sections.value.length) return

    const snapshot = cloneSections(sections.value)
    const [section] = sections.value.splice(fromIndex, 1)
    if (!section) return

    sections.value.splice(toIndex, 0, section)
    reindexSectionOrders(sections.value)

    const appCommon = useAppCommonStore()

    try {
      const updatedSections = await BUDGET_API.moveSection({
        sectionId: section.id,
        targetIndex: toIndex,
      }, selectedUserId.value ?? undefined)
      applyMovedSections(updatedSections)
    } catch (error) {
      sections.value = snapshot
      appCommon.showError(error instanceof Error ? error : new Error('errors.budget.failedToUpdateSection'))
    }
  }

  async function moveItem(
    fromSectionId: number,
    toSectionId: number,
    fromIndex: number,
    toIndex: number,
  ): Promise<void> {
    if (fromSectionId === toSectionId && fromIndex === toIndex) return

    const fromSection = findSection(fromSectionId)
    const toSection = findSection(toSectionId)
    if (!fromSection || !toSection) return
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= fromSection.items.length || toIndex > toSection.items.length) return

    const snapshot = cloneSections(sections.value)
    const [item] = fromSection.items.splice(fromIndex, 1)
    if (!item) return

    item.sectionId = toSectionId
    toSection.items.splice(toIndex, 0, item)
    reindexItemOrders(fromSection)

    if (fromSection !== toSection) {
      reindexItemOrders(toSection)
    }

    const appCommon = useAppCommonStore()

    try {
      const updatedSections = await BUDGET_API.moveItem({
        itemId: item.id,
        targetSectionId: toSectionId,
        targetIndex: toIndex,
      }, selectedUserId.value ?? undefined)
      applyMovedSections(updatedSections)
    } catch (error) {
      sections.value = snapshot
      appCommon.showError(error instanceof Error ? error : new Error('errors.budget.failedToUpdateItem'))
    }
  }

  function toBaseCurrency(amount: number, from: BudgetCurrency): number {
    if (from === currency.value) return amount
    const cs = useCurrencyStore()
    const converted = cs.convert(amount, from, currency.value)
    return converted !== null ? Math.round(converted) : amount
  }

  const totals = computed<BudgetTotals>(() => {
    const items = sections.value.flatMap((section) => section.items)

    const planned = items.reduce((sum, i) => sum + toBaseCurrency(i.estimatedCost, i.currency), 0)
    const deposit = items.reduce((sum, i) => sum + toBaseCurrency(i.deposit ?? 0, i.currency), 0)
    const paidWithoutDeposit = items.reduce((sum, item) => {
      if (typeof item.actualCost === 'number') {
        return sum + toBaseCurrency(item.actualCost, item.currency)
      }
      if (item.paid) {
        return sum + toBaseCurrency(item.estimatedCost, item.currency)
      }
      return sum
    }, 0)

    const paid = paidWithoutDeposit + deposit
    const remaining = planned - paid

    const byPriority = {
      must: items.filter((i) => i.priority === 'must').reduce((sum, i) => sum + toBaseCurrency(i.estimatedCost, i.currency), 0),
      want: items.filter((i) => i.priority === 'want').reduce((sum, i) => sum + toBaseCurrency(i.estimatedCost, i.currency), 0),
      maybe: items.filter((i) => i.priority === 'maybe').reduce((sum, i) => sum + toBaseCurrency(i.estimatedCost, i.currency), 0),
    }

    const percentUsed = budgetLimit.value > 0 ? Math.round((planned / budgetLimit.value) * 100) : 0

    const itemsWithActual = items.filter((i) => typeof i.actualCost === 'number')
    const deviationEstimated = itemsWithActual.reduce((sum, i) => sum + toBaseCurrency(i.estimatedCost, i.currency), 0)
    const deviationActual = itemsWithActual.reduce((sum, i) => sum + toBaseCurrency((i.actualCost ?? 0) + (i.deposit ?? 0), i.currency), 0)

    return { planned, paid, deposit, remaining, byPriority, percentUsed, deviationEstimated, deviationActual }
  })

  const multiCurrencyTotals = computed<MultiCurrencyTotals>(() => {
    const items = sections.value.flatMap((section) => section.items)
    const base = currency.value

    function accumulate(acc: Partial<Record<BudgetCurrency, number>>, cur: BudgetCurrency, val: number) {
      acc[cur] = (acc[cur] ?? 0) + val
    }

    function makeBreakdown(byCurrency: Partial<Record<BudgetCurrency, number>>): CurrencyBreakdown {
      const total = Object.entries(byCurrency).reduce(
        (sum, [cur, val]) => sum + toBaseCurrency(val!, cur as BudgetCurrency), 0,
      )
      return { byCurrency, total }
    }

    const plannedBy: Partial<Record<BudgetCurrency, number>> = {}
    const paidBy: Partial<Record<BudgetCurrency, number>> = {}
    const depositBy: Partial<Record<BudgetCurrency, number>> = {}
    const mustBy: Partial<Record<BudgetCurrency, number>> = {}
    const wantBy: Partial<Record<BudgetCurrency, number>> = {}
    const maybeBy: Partial<Record<BudgetCurrency, number>> = {}
    const devEstBy: Partial<Record<BudgetCurrency, number>> = {}
    const devActBy: Partial<Record<BudgetCurrency, number>> = {}

    for (const item of items) {
      accumulate(plannedBy, item.currency, item.estimatedCost)

      if (item.deposit) {
        accumulate(depositBy, item.currency, item.deposit)
        accumulate(paidBy, item.currency, item.deposit)
      }
      if (typeof item.actualCost === 'number') {
        accumulate(paidBy, item.currency, item.actualCost)
        accumulate(devEstBy, item.currency, item.estimatedCost)
        accumulate(devActBy, item.currency, item.actualCost + (item.deposit ?? 0))
      } else if (item.paid) {
        accumulate(paidBy, item.currency, item.estimatedCost)
      }

      const priorityTarget = item.priority === 'must' ? mustBy : item.priority === 'want' ? wantBy : maybeBy
      accumulate(priorityTarget, item.currency, item.estimatedCost)
    }

    const allCurrencies = new Set([...Object.keys(plannedBy), ...Object.keys(paidBy)]) as Set<BudgetCurrency>
    const remainingBy: Partial<Record<BudgetCurrency, number>> = {}
    for (const cur of allCurrencies) {
      const p = plannedBy[cur] ?? 0
      const pd = paidBy[cur] ?? 0
      if (p !== 0 || pd !== 0) remainingBy[cur] = p - pd
    }

    return {
      planned: makeBreakdown(plannedBy),
      paid: makeBreakdown(paidBy),
      deposit: makeBreakdown(depositBy),
      remaining: makeBreakdown(remainingBy),
      deviationEstimated: makeBreakdown(devEstBy),
      deviationActual: makeBreakdown(devActBy),
      byPriority: {
        must: makeBreakdown(mustBy),
        want: makeBreakdown(wantBy),
        maybe: makeBreakdown(maybeBy),
      },
      hasNonBaseCurrency: items.some((i) => i.currency !== base),
    }
  })

  function getSectionTotal(sectionId: number): number {
    return findSection(sectionId)?.items.reduce((sum, item) => sum + item.estimatedCost, 0) ?? 0
  }

  function getSectionItems(sectionId: number): BudgetItem[] {
    return findSection(sectionId)?.items ?? []
  }

  return {
    rows,
    budgetLimit,
    currency,
    totals,
    multiCurrencyTotals,
    formatCurrency,
    formatCurrencyAmount,
    fetchBudget,
    addSection,
    updateSection,
    deleteSection,
    moveSection,
    toggleCollapse,
    expandSection,
    getSectionItems,
    addItem,
    updateItem,
    deleteItem,
    moveItem,
    cyclePriority,
    setBudgetLimit,
    setCurrency,
    getSectionTotal,
  }
})
