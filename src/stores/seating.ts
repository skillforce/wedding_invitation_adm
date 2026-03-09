import { defineStore } from 'pinia'
import { ref } from 'vue'
import { SEATING_ARRANGEMENT_API } from '@/api/seating-arrangement'
import { useDebouncedAction } from '@/composables/useDebouncedAction'
import { useAppCommonStore } from '@/stores/app_common'
import i18n from '@/i18n'

export interface SeatingGuest {
  id: string
  name: string
}

export type { SeatingShape } from '@/api/seating-arrangement'
import type { SeatingShape } from '@/api/seating-arrangement'

export interface SeatingTable {
  id: string
  name: string
  x: number
  y: number
  radius: number
  guests: SeatingGuest[]
  shape: SeatingShape
  rotation: number
}

export const useSeatingStore = defineStore('seating', () => {
  const tables = ref<SeatingTable[]>([])

  async function fetchTables() {
    try {
      const data = await SEATING_ARRANGEMENT_API.getTables()
      tables.value = data.map((t) => ({
        id: t.id,
        name: t.name,
        x: t.position.x,
        y: t.position.y,
        radius: t.radius,
        shape: t.shape,
        rotation: t.rotation,
        guests: t.seats.map((s) => ({ id: s.id, name: s.name })),
      }))
    } catch (error) {
      useAppCommonStore().showError(error)
    }
  }

  function defaultNameForShape(shape: SeatingShape, idx: number): string {
    if (shape === 'rect') return i18n.global.t('seating.defaultNewlywedTableName', { index: idx })
    if (shape === 'pillar') return i18n.global.t('seating.defaultPillarName', { index: idx })
    return i18n.global.t('seating.defaultTableName', { index: idx })
  }

  async function addObject(shape: SeatingShape = 'circle') {
    try {
      const idx = tables.value.length + 1
      const created = await SEATING_ARRANGEMENT_API.createTable({
        name: defaultNameForShape(shape, idx),
        position: { x: 160 + Math.random() * 480, y: 160 + Math.random() * 320 },
        shape,
        rotation: 0,
      })
      tables.value.push({
        id: created.id,
        name: created.name,
        x: created.position.x,
        y: created.position.y,
        radius: created.radius,
        shape: created.shape,
        rotation: created.rotation,
        guests: [],
      })
    } catch (error) {
      useAppCommonStore().showError(error)
    }
  }

  async function updateTablePosition(id: string, x: number, y: number) {
    const table = tables.value.find((t) => t.id === id)
    if (!table) return
    table.x = x
    table.y = y
    try {
      await SEATING_ARRANGEMENT_API.updateTable(id, { position: { x, y } })
    } catch (error) {
      useAppCommonStore().showError(error)
    }
  }

  async function renameTable(id: string, name: string) {
    const table = tables.value.find((t) => t.id === id)
    if (!table) return
    table.name = name
    try {
      await SEATING_ARRANGEMENT_API.updateTable(id, { name })
    } catch (error) {
      useAppCommonStore().showError(error)
    }
  }

  async function addGuest(tableId: string, guestName: string) {
    const table = tables.value.find((t) => t.id === tableId)
    if (!table) return
    try {
      const seat = await SEATING_ARRANGEMENT_API.addSeat(tableId, guestName)
      table.guests.push({ id: seat.id, name: seat.name })
    } catch (error) {
      useAppCommonStore().showError(error)
    }
  }

  async function removeGuest(tableId: string, guestId: string) {
    const table = tables.value.find((t) => t.id === tableId)
    if (!table) return
    try {
      await SEATING_ARRANGEMENT_API.removeSeat(tableId, guestId)
      table.guests = table.guests.filter((g) => g.id !== guestId)
    } catch (error) {
      useAppCommonStore().showError(error)
    }
  }

  async function moveGuestBetweenTables(sourceTableId: string, targetTableId: string, guestId: string) {
    if (sourceTableId === targetTableId) return

    const sourceTable = tables.value.find((t) => t.id === sourceTableId)
    const targetTable = tables.value.find((t) => t.id === targetTableId)
    if (!sourceTable || !targetTable) return
    if (sourceTable.shape === 'pillar' || targetTable.shape === 'pillar') return

    const sourceIndex = sourceTable.guests.findIndex((g) => g.id === guestId)
    if (sourceIndex === -1) return

    const guest = sourceTable.guests[sourceIndex]
    if (!guest) return

    sourceTable.guests.splice(sourceIndex, 1)
    const targetIndex = targetTable.guests.push(guest) - 1
    let createdSeatId: string | null = null

    try {
      const createdSeat = await SEATING_ARRANGEMENT_API.addSeat(targetTableId, guest.name)
      createdSeatId = createdSeat.id
      await SEATING_ARRANGEMENT_API.removeSeat(sourceTableId, guest.id)

      const movedIndex = targetTable.guests.findIndex((g) => g.id === guest.id)
      if (movedIndex !== -1) {
        targetTable.guests[movedIndex] = {
          id: createdSeat.id,
          name: createdSeat.name,
        }
      }
    } catch (error) {
      if (createdSeatId) {
        try {
          await SEATING_ARRANGEMENT_API.removeSeat(targetTableId, createdSeatId)
        } catch (cleanupError) {
          useAppCommonStore().showError(cleanupError)
        }
      }

      if (targetTable.guests[targetIndex]?.id === guest.id) {
        targetTable.guests.splice(targetIndex, 1)
      } else {
        targetTable.guests = targetTable.guests.filter((g) => g.id !== guest.id)
      }
      sourceTable.guests.splice(sourceIndex, 0, guest)
      useAppCommonStore().showError(error)
    }
  }

  const debouncedRotation = useDebouncedAction<string, [number]>(
    (id, rotation) => {
      SEATING_ARRANGEMENT_API.updateTable(id, { rotation })
        .catch((error) => useAppCommonStore().showError(error))
    },
  )

  function setTableRotation(id: string, rotation: number) {
    const table = tables.value.find((t) => t.id === id)
    if (!table) return
    table.rotation = rotation
    debouncedRotation.call(id, rotation)
  }

  const debouncedRadius = useDebouncedAction<string, [number]>(
    (id, radius) => {
      SEATING_ARRANGEMENT_API.updateTable(id, { radius })
        .catch((error) => useAppCommonStore().showError(error))
    },
  )

  function updateTableRadius(id: string, radius: number) {
    const table = tables.value.find((t) => t.id === id)
    if (!table) return
    table.radius = radius
    debouncedRadius.call(id, radius)
  }

  async function deleteTable(id: string) {
    try {
      await SEATING_ARRANGEMENT_API.deleteTable(id)
      tables.value = tables.value.filter((t) => t.id !== id)
    } catch (error) {
      useAppCommonStore().showError(error)
    }
  }

  return {
    tables,
    fetchTables,
    addObject,
    updateTablePosition,
    updateTableRadius,
    renameTable,
    addGuest,
    removeGuest,
    moveGuestBetweenTables,
    setTableRotation,
    deleteTable,
  }
})
