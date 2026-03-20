import { HttpMethod, apiFetch, parseApiError } from '@/api/consts'
import type { BudgetCurrency, BudgetDto, Priority } from '@/types/budget'

export interface PatchBudgetDto {
  budgetLimit?: number
  currency?: BudgetCurrency
}

export interface CreateSectionDto {
  name: string
}

export interface PatchSectionDto {
  name?: string
}

export interface CreateItemDto {
  sectionId: number
  name: string
  estimatedCost?: number
  deposit?: number | null
  priority?: Priority
}

export interface PatchItemDto {
  name?: string
  estimatedCost?: number
  actualCost?: number | null
  deposit?: number | null
  priority?: Priority
  paid?: boolean
}

export const BUDGET_API = {
  async getBudget(): Promise<BudgetDto> {
    const res = await apiFetch('/budget')
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async patchBudget(dto: PatchBudgetDto): Promise<BudgetDto> {
    const res = await apiFetch('/budget', {
      method: HttpMethod.PATCH,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async createSection(dto: CreateSectionDto): Promise<BudgetDto> {
    const res = await apiFetch('/budget/sections', {
      method: HttpMethod.POST,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async patchSection(id: number, dto: PatchSectionDto): Promise<BudgetDto> {
    const res = await apiFetch(`/budget/sections/${id}`, {
      method: HttpMethod.PATCH,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async deleteSection(id: number): Promise<void> {
    const res = await apiFetch(`/budget/sections/${id}`, {
      method: HttpMethod.DELETE,
    })
    if (!res.ok) throw await parseApiError(res)
  },

  async createItem(dto: CreateItemDto): Promise<BudgetDto> {
    const res = await apiFetch('/budget/items', {
      method: HttpMethod.POST,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async patchItem(id: number, dto: PatchItemDto): Promise<BudgetDto> {
    const res = await apiFetch(`/budget/items/${id}`, {
      method: HttpMethod.PATCH,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async deleteItem(id: number): Promise<void> {
    const res = await apiFetch(`/budget/items/${id}`, {
      method: HttpMethod.DELETE,
    })
    if (!res.ok) throw await parseApiError(res)
  },
}