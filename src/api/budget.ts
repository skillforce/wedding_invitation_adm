import { HttpMethod, apiFetch, parseApiError, qs } from '@/api/consts'
import type { BudgetCurrency, BudgetDto, BudgetSectionDto, Priority } from '@/types/budget'

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
  currency: BudgetCurrency
  estimatedCost?: number
  deposit?: number | null
  priority?: Priority
}

export interface PatchItemDto {
  name?: string
  currency?: BudgetCurrency
  estimatedCost?: number
  actualCost?: number | null
  deposit?: number | null
  priority?: Priority
  paid?: boolean
}

export interface MoveSectionDto {
  sectionId: number
  targetIndex: number
}

export interface MoveItemDto {
  itemId: number
  targetSectionId: number
  targetIndex: number
}

export const BUDGET_API = {
  async getBudget(userId?: number): Promise<BudgetDto> {
    const res = await apiFetch(`/budget${qs(userId)}`)
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async patchBudget(dto: PatchBudgetDto, userId?: number): Promise<BudgetDto> {
    const res = await apiFetch(`/budget${qs(userId)}`, {
      method: HttpMethod.PATCH,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async createSection(dto: CreateSectionDto, userId?: number): Promise<BudgetDto> {
    const res = await apiFetch(`/budget/sections${qs(userId)}`, {
      method: HttpMethod.POST,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async patchSection(id: number, dto: PatchSectionDto, userId?: number): Promise<BudgetDto> {
    const res = await apiFetch(`/budget/sections/${id}${qs(userId)}`, {
      method: HttpMethod.PATCH,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async moveSection(dto: MoveSectionDto, userId?: number): Promise<BudgetSectionDto[]> {
    const res = await apiFetch(`/budget/sections/move${qs(userId)}`, {
      method: HttpMethod.PATCH,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async deleteSection(id: number, userId?: number): Promise<void> {
    const res = await apiFetch(`/budget/sections/${id}${qs(userId)}`, {
      method: HttpMethod.DELETE,
    })
    if (!res.ok) throw await parseApiError(res)
  },

  async createItem(dto: CreateItemDto, userId?: number): Promise<BudgetDto> {
    const res = await apiFetch(`/budget/items${qs(userId)}`, {
      method: HttpMethod.POST,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async patchItem(id: number, dto: PatchItemDto, userId?: number): Promise<BudgetDto> {
    const res = await apiFetch(`/budget/items/${id}${qs(userId)}`, {
      method: HttpMethod.PATCH,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async moveItem(dto: MoveItemDto, userId?: number): Promise<BudgetSectionDto[]> {
    const res = await apiFetch(`/budget/items/move${qs(userId)}`, {
      method: HttpMethod.PATCH,
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },

  async deleteItem(id: number, userId?: number): Promise<void> {
    const res = await apiFetch(`/budget/items/${id}${qs(userId)}`, {
      method: HttpMethod.DELETE,
    })
    if (!res.ok) throw await parseApiError(res)
  },
}
