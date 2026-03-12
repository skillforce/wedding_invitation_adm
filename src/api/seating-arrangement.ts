import { apiFetch, parseApiError } from '@/api/consts'

export type WorkspaceShape = 'circle' | 'rect'
export type SeatingShape = WorkspaceShape | 'pillar'

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
  async getArrangement(): Promise<SeatingArrangementDto> {
    return requestJson('/tables')
  },

  async updateArrangement(dto: UpdateSeatingArrangementDto): Promise<SeatingArrangementDto> {
    return requestJson('/arrangement', {
      method: 'PATCH',
      body: JSON.stringify(dto),
    })
  },

  async createTable(dto: CreateSeatingTableDto): Promise<SeatingTableDto> {
    return requestJson('/tables', {
      method: 'POST',
      body: JSON.stringify(dto),
    })
  },

  async updateTable(id: string, dto: UpdateSeatingTableDto): Promise<SeatingTableDto> {
    return requestJson(`/tables/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    })
  },

  async deleteTable(id: string): Promise<void> {
    return requestVoid(`/tables/${id}`, { method: 'DELETE' })
  },

  async addSeat(tableId: string, guestId: string): Promise<SeatingSeatDto> {
    return requestJson(`/tables/${tableId}/seats`, {
      method: 'POST',
      body: JSON.stringify({ guest_id: guestId }),
    })
  },

  async removeSeat(tableId: string, seatId: string): Promise<void> {
    return requestVoid(`/tables/${tableId}/seats/${seatId}`, { method: 'DELETE' })
  },
}
