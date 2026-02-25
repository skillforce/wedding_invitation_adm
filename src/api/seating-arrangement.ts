import { apiFetch } from '@/api/consts'

export interface SeatingSeatDto {
  id: string
  name: string
}

export interface SeatingTableDto {
  id: string
  name: string
  position: { x: number; y: number }
  shape: 'circle' | 'rect'
  rotation: number
  seats: SeatingSeatDto[]
}

export interface CreateSeatingTableDto {
  name: string
  position: { x: number; y: number }
  shape?: 'circle' | 'rect'
  rotation?: number
}

export interface UpdateSeatingTableDto {
  name: string
  position: { x: number; y: number }
  shape: 'circle' | 'rect'
  rotation: number
}

const BASE = '/seating-arrangements'

export const SEATING_ARRANGEMENT_API = {
  async getTables(): Promise<SeatingTableDto[]> {
    const res = await apiFetch(`${BASE}/tables`)
    if (!res.ok) throw new Error('errors.seating.failedToLoadTables')
    return res.json()
  },

  async createTable(dto: CreateSeatingTableDto): Promise<SeatingTableDto> {
    const res = await apiFetch(`${BASE}/tables`, {
      method: 'POST',
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw new Error('errors.seating.failedToCreateTable')
    return res.json()
  },

  async updateTable(id: string, dto: UpdateSeatingTableDto): Promise<SeatingTableDto> {
    const res = await apiFetch(`${BASE}/tables/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw new Error('errors.seating.failedToUpdateTable')
    return res.json()
  },

  async deleteTable(id: string): Promise<void> {
    const res = await apiFetch(`${BASE}/tables/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('errors.seating.failedToDeleteTable')
  },

  async addSeat(tableId: string, name: string): Promise<SeatingSeatDto> {
    const res = await apiFetch(`${BASE}/tables/${tableId}/seats`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    })
    if (!res.ok) throw new Error('errors.seating.failedToAddSeat')
    return res.json()
  },

  async removeSeat(tableId: string, seatId: string): Promise<void> {
    const res = await apiFetch(`${BASE}/tables/${tableId}/seats/${seatId}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('errors.seating.failedToRemoveSeat')
  },
}
