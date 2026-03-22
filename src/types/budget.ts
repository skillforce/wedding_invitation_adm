export type Priority = 'must' | 'want' | 'maybe'

export type BudgetCurrency = 'RUB' | 'USD' | 'BYN'

export interface BudgetItemDto {
  id: number
  name: string
  estimatedCost: number
  actualCost: number | null
  deposit: number | null
  priority: Priority
  paid: boolean
}

export interface BudgetSectionDto {
  id: number
  name: string
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
  type: 'section'
  name: string
  collapsed?: boolean
}

export interface BudgetItem {
  id: number
  type: 'item'
  sectionId: number
  name: string
  estimatedCost: number
  actualCost: number | null
  deposit: number | null
  priority: Priority
  paid: boolean
}

export type BudgetRow = BudgetSection | BudgetItem

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