import { defineStore } from 'pinia'
import { ref } from 'vue'
import { SEATING_ARRANGEMENT_API } from '@/api/seating-arrangement'
import i18n from '@/i18n'

export interface SeatingGuest {
  id: string
  name: string
}

export interface SeatingTable {
  id: string
  name: string
  x: number
  y: number
  radius: number
  guests: SeatingGuest[]
  shape?: 'circle' | 'rect'
  rotation?: number
}

const DEFAULT_RADIUS = 70

export const useSeatingStore = defineStore('seating', () => {
  const tables = ref<SeatingTable[]>([])

  async function fetchTables() {
    const data = await SEATING_ARRANGEMENT_API.getTables()
    tables.value = data.map((t) => ({
      id: t.id,
      name: t.name,
      x: t.position.x,
      y: t.position.y,
      radius: DEFAULT_RADIUS,
      shape: t.shape,
      rotation: t.rotation,
      guests: t.seats.map((s) => ({ id: s.id, name: s.name })),
    }))
  }

  async function addTable() {
    const idx = tables.value.length + 1
    const created = await SEATING_ARRANGEMENT_API.createTable({
      name: i18n.global.t('seating.defaultTableName', { index: idx }),
      position: { x: 160 + Math.random() * 480, y: 160 + Math.random() * 320 },
      shape: 'circle',
      rotation: 0,
    })
    tables.value.push({
      id: created.id,
      name: created.name,
      x: created.position.x,
      y: created.position.y,
      radius: DEFAULT_RADIUS,
      shape: created.shape,
      rotation: created.rotation,
      guests: [],
    })
  }

  async function updateTablePosition(id: string, x: number, y: number) {
    const table = tables.value.find((t) => t.id === id)
    if (!table) return
    table.x = x
    table.y = y
    await SEATING_ARRANGEMENT_API.updateTable(id, {
      name: table.name,
      position: { x, y },
      shape: table.shape ?? 'circle',
      rotation: table.rotation ?? 0,
    })
  }

  async function renameTable(id: string, name: string) {
    const table = tables.value.find((t) => t.id === id)
    if (!table) return
    table.name = name
    await SEATING_ARRANGEMENT_API.updateTable(id, {
      name,
      position: { x: table.x, y: table.y },
      shape: table.shape ?? 'circle',
      rotation: table.rotation ?? 0,
    })
  }

  async function addGuest(tableId: string, guestName: string) {
    const table = tables.value.find((t) => t.id === tableId)
    if (!table) return
    const seat = await SEATING_ARRANGEMENT_API.addSeat(tableId, guestName)
    table.guests.push({ id: seat.id, name: seat.name })
  }

  async function removeGuest(tableId: string, guestId: string) {
    const table = tables.value.find((t) => t.id === tableId)
    if (!table) return
    await SEATING_ARRANGEMENT_API.removeSeat(tableId, guestId)
    table.guests = table.guests.filter((g) => g.id !== guestId)
  }

  const rotationTimers = new Map<string, ReturnType<typeof setTimeout>>()

  function setTableRotation(id: string, rotation: number) {
    const table = tables.value.find((t) => t.id === id)
    if (!table) return
    table.rotation = rotation

    const existing = rotationTimers.get(id)
    if (existing) clearTimeout(existing)

    rotationTimers.set(
      id,
      setTimeout(() => {
        rotationTimers.delete(id)
        SEATING_ARRANGEMENT_API.updateTable(id, {
          name: table.name,
          position: { x: table.x, y: table.y },
          shape: table.shape ?? 'circle',
          rotation,
        })
      }, 1000),
    )
  }

  async function deleteTable(id: string) {
    await SEATING_ARRANGEMENT_API.deleteTable(id)
    tables.value = tables.value.filter((t) => t.id !== id)
  }

  return {
    tables,
    fetchTables,
    addTable,
    updateTablePosition,
    renameTable,
    addGuest,
    removeGuest,
    setTableRotation,
    deleteTable,
  }
})
