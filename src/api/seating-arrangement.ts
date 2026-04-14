import { apiFetch, parseApiError, qs } from '@/api/consts'

export type WorkspaceShape = 'circle' | 'rect'
export enum SeatingShape {
  Circle = 'circle',
  Rect = 'rect',
  Pillar = 'pillar',
}

export interface SeatingPosition {
  x: number
  y: number
}

export interface SeatingSeatDto {
  id: string
  guest_id: string
  name: string
}

export interface SeatingTableDto {
  id: string
  name: string
  position: SeatingPosition
  shape: SeatingShape
  rotation: number
  radius: number
  seats: SeatingSeatDto[]
}

export interface SeatingArrangementDto {
  shape: WorkspaceShape
  width: number
  height: number
  max_tables_amount: number
  max_seats_per_table_amount: number
  items: SeatingTableDto[]
}

export interface UpdateSeatingArrangementDto {
  shape?: WorkspaceShape
  width?: number
  height?: number
  max_tables_amount?: number
  max_seats_per_table_amount?: number
}

export interface CreateSeatingTableDto {
  name: string
  position: SeatingPosition
  shape?: SeatingShape
  rotation?: number
  radius?: number
}

export interface UpdateSeatingTableDto {
  name?: string
  position?: SeatingPosition
  shape?: SeatingShape
  rotation?: number
  radius?: number
}

const BASE = '/seating-arrangements'


async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await apiFetch(`${BASE}${path}`, init)
  if (!res.ok) throw await parseApiError(res)
  return res.json()
}

async function requestVoid(path: string, init?: RequestInit): Promise<void> {
  const res = await apiFetch(`${BASE}${path}`, init)
  if (!res.ok) throw await parseApiError(res)
}

export const SEATING_ARRANGEMENT_API = {
  async getArrangement(userId?: number): Promise<SeatingArrangementDto> {
    return requestJson(`/tables${qs(userId)}`)
  },

  async updateArrangement(dto: UpdateSeatingArrangementDto, userId?: number): Promise<SeatingArrangementDto> {
    return requestJson(`/arrangement${qs(userId)}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    })
  },

  async createTable(dto: CreateSeatingTableDto, userId?: number): Promise<SeatingTableDto> {
    return requestJson(`/tables${qs(userId)}`, {
      method: 'POST',
      body: JSON.stringify(dto),
    })
  },

  async updateTable(id: string, dto: UpdateSeatingTableDto, userId?: number): Promise<SeatingTableDto> {
    return requestJson(`/tables/${id}${qs(userId)}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    })
  },

  async deleteTable(id: string, userId?: number): Promise<void> {
    return requestVoid(`/tables/${id}${qs(userId)}`, { method: 'DELETE' })
  },

  async addSeat(tableId: string, guestId: string, userId?: number): Promise<SeatingSeatDto> {
    return requestJson(`/tables/${tableId}/seats${qs(userId)}`, {
      method: 'POST',
      body: JSON.stringify({ guest_id: guestId }),
    })
  },

  async removeSeat(tableId: string, seatId: string, userId?: number): Promise<void> {
    return requestVoid(`/tables/${tableId}/seats/${seatId}${qs(userId)}`, { method: 'DELETE' })
  },

  async autoSeat(userId?: number): Promise<SeatingArrangementDto> {
    return requestJson(`/arrangement/auto-seat${qs(userId)}`, { method: 'POST' })
  },
}
