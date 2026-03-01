export type Priority = 'must' | 'want' | 'maybe'

export type BudgetCurrency = 'RUB' | 'USD' | 'BYN'

export interface BudgetSection {
  id: string
  type: 'section'
  name: string
  collapsed?: boolean
}

export interface BudgetItem {
  id: string
  type: 'item'
  sectionId: string
  name: string
  estimatedCost: number
  actualCost: number | null
  priority: Priority
  paid: boolean
  notes?: string
}

export type BudgetRow = BudgetSection | BudgetItem

export interface BudgetState {
  rows: BudgetRow[]
  budgetLimit: number
}

export interface BudgetTotals {
  planned: number
  paid: number
  remaining: number
  byPriority: {
    must: number
    want: number
    maybe: number
  }
  percentUsed: number
}