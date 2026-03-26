export type Priority = 'must' | 'want' | 'maybe'

export type BudgetCurrency = 'RUB' | 'USD' | 'BYN'

export enum BudgetRowType {
  Section = 'section',
  Item = 'item',
}

export interface BudgetItemDto {
  id: number
  name: string
  currency: BudgetCurrency
  sortOrder: number
  estimatedCost: number
  actualCost: number | null
  deposit: number | null
  priority: Priority
  paid: boolean
}

export interface BudgetSectionDto {
  id: number
  name: string
  sortOrder: number
  items: BudgetItemDto[]
}

export interface BudgetDto {
  id: number
  budgetLimit: number
  currency: BudgetCurrency
  sections: BudgetSectionDto[]
}

export interface BudgetSection {
  id: number
  type: BudgetRowType.Section
  name: string
  sortOrder: number
  collapsed?: boolean
}

export interface BudgetItem {
  id: number
  type: BudgetRowType.Item
  sectionId: number
  name: string
  currency: BudgetCurrency
  sortOrder: number
  estimatedCost: number
  actualCost: number | null
  deposit: number | null
  priority: Priority
  paid: boolean
}

export type BudgetRow = BudgetSection | BudgetItem

export interface CurrencyBreakdown {
  byCurrency: Partial<Record<BudgetCurrency, number>>
  total: number
}

export interface BudgetTotals {
  planned: number
  paid: number
  deposit: number
  remaining: number
  byPriority: {
    must: number
    want: number
    maybe: number
  }
  percentUsed: number
  deviationEstimated: number
  deviationActual: number
}

export interface MultiCurrencyTotals {
  planned: CurrencyBreakdown
  paid: CurrencyBreakdown
  deposit: CurrencyBreakdown
  remaining: CurrencyBreakdown
  deviationEstimated: CurrencyBreakdown
  deviationActual: CurrencyBreakdown
  byPriority: {
    must: CurrencyBreakdown
    want: CurrencyBreakdown
    maybe: CurrencyBreakdown
  }
  hasNonBaseCurrency: boolean
}
