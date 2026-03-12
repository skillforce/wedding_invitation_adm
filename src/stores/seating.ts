import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  SEATING_ARRANGEMENT_API,
  type SeatingArrangementDto,
  type SeatingShape,
  type WorkspaceShape,
} from '@/api/seating-arrangement'
import { useDebouncedAction } from '@/composables/useDebouncedAction'
import { useAppCommonStore } from '@/stores/app_common'
import i18n from '@/i18n'

export interface SeatingGuest {
  id: string
  guestId: string
  name: string
}

export type { SeatingShape, WorkspaceShape } from '@/api/seating-arrangement'

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

export interface SeatingWorkspacePatch {
  shape?: WorkspaceShape
  width?: number
  height?: number
  maxTablesAmount?: number
  maxSeatsPerTableAmount?: number
}

const MIN_WIDTH = 1600
const MAX_WIDTH = 2720
const MIN_HEIGHT = 900
const MAX_HEIGHT = 1530
const MIN_TABLES_AMOUNT = 1
const MAX_TABLES_AMOUNT = 40
const MIN_SEATS_PER_TABLE_AMOUNT = 1
const MAX_SEATS_PER_TABLE_AMOUNT = 30
const DEFAULT_TABLE_RADIUS = 60

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function mapArrangement(data: SeatingArrangementDto) {
  return data.items.map((table) => ({
    id: table.id,
    name: table.name,
    x: table.position.x,
    y: table.position.y,
    radius: table.radius,
    shape: table.shape,
    rotation: table.rotation,
    guests: table.seats.map((seat) => ({
      id: seat.id,
      guestId: seat.guest_id,
      name: seat.name,
    })),
  }))
}

export const useSeatingStore = defineStore('seating', () => {
  const appCommonStore = useAppCommonStore()

  const tables = ref<SeatingTable[]>([])
  const workspaceShape = ref<WorkspaceShape>('rect')
  const workspaceWidth = ref(MIN_WIDTH)
  const workspaceHeight = ref(MIN_HEIGHT)
  const maxTablesAmount = ref(20)
  const maxSeatsPerTableAmount = ref(8)

  const workspaceBounds = computed(() => ({
    minWidth: MIN_WIDTH,
    maxWidth: MAX_WIDTH,
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
  }))

  const workspaceLimits = computed(() => ({
    minTablesAmount: MIN_TABLES_AMOUNT,
    maxTablesAmount: MAX_TABLES_AMOUNT,
    minSeatsPerTableAmount: MIN_SEATS_PER_TABLE_AMOUNT,
    maxSeatsPerTableAmount: MAX_SEATS_PER_TABLE_AMOUNT,
  }))

  function applyArrangement(data: SeatingArrangementDto) {
    workspaceShape.value = data.shape
    workspaceWidth.value = clamp(data.width, MIN_WIDTH, MAX_WIDTH)
    workspaceHeight.value = clamp(data.height, MIN_HEIGHT, MAX_HEIGHT)
    maxTablesAmount.value = clamp(data.max_tables_amount, MIN_TABLES_AMOUNT, MAX_TABLES_AMOUNT)
    maxSeatsPerTableAmount.value = clamp(
      data.max_seats_per_table_amount,
      MIN_SEATS_PER_TABLE_AMOUNT,
      MAX_SEATS_PER_TABLE_AMOUNT,
    )
    tables.value = mapArrangement(data)
  }

  function applyWorkspacePatchLocally(patch: SeatingWorkspacePatch) {
    if (patch.shape) workspaceShape.value = patch.shape
    if (patch.width !== undefined) workspaceWidth.value = clamp(patch.width, MIN_WIDTH, MAX_WIDTH)
    if (patch.height !== undefined) workspaceHeight.value = clamp(patch.height, MIN_HEIGHT, MAX_HEIGHT)
    if (patch.maxTablesAmount !== undefined) {
      maxTablesAmount.value = clamp(patch.maxTablesAmount, MIN_TABLES_AMOUNT, MAX_TABLES_AMOUNT)
    }
    if (patch.maxSeatsPerTableAmount !== undefined) {
      maxSeatsPerTableAmount.value = clamp(
        patch.maxSeatsPerTableAmount,
        MIN_SEATS_PER_TABLE_AMOUNT,
        MAX_SEATS_PER_TABLE_AMOUNT,
      )
    }
  }

  function toArrangementPatch(patch: SeatingWorkspacePatch) {
    return {
      shape: patch.shape,
      width: patch.width !== undefined ? clamp(patch.width, MIN_WIDTH, MAX_WIDTH) : undefined,
      height: patch.height !== undefined ? clamp(patch.height, MIN_HEIGHT, MAX_HEIGHT) : undefined,
      max_tables_amount:
        patch.maxTablesAmount !== undefined
          ? clamp(patch.maxTablesAmount, MIN_TABLES_AMOUNT, MAX_TABLES_AMOUNT)
          : undefined,
      max_seats_per_table_amount:
        patch.maxSeatsPerTableAmount !== undefined
          ? clamp(
            patch.maxSeatsPerTableAmount,
            MIN_SEATS_PER_TABLE_AMOUNT,
            MAX_SEATS_PER_TABLE_AMOUNT,
          )
          : undefined,
    }
  }

  async function fetchTables() {
    try {
      const data = await SEATING_ARRANGEMENT_API.getArrangement()
      applyArrangement(data)
    } catch (error) {
      appCommonStore.showError(error)
    }
  }

  function defaultNameForShape(shape: SeatingShape, idx: number): string {
    if (shape === 'rect') return i18n.global.t('seating.defaultNewlywedTableName', { index: idx })
    if (shape === 'pillar') return i18n.global.t('seating.defaultPillarName', { index: idx })
    return i18n.global.t('seating.defaultTableName', { index: idx })
  }

  async function updateWorkspace(patch: SeatingWorkspacePatch) {
    const previous = {
      shape: workspaceShape.value,
      width: workspaceWidth.value,
      height: workspaceHeight.value,
      maxTablesAmount: maxTablesAmount.value,
      maxSeatsPerTableAmount: maxSeatsPerTableAmount.value,
    }

    applyWorkspacePatchLocally(patch)

    try {
      const data = await SEATING_ARRANGEMENT_API.updateArrangement(toArrangementPatch(patch))
      applyArrangement(data)
    } catch (error) {
      applyWorkspacePatchLocally(previous)
      appCommonStore.showError(error)
      throw error
    }
  }

  const debouncedWorkspaceSize = useDebouncedAction<'workspace-size', [number, number]>(
    async (_key, width, height) => {
      try {
        const data = await SEATING_ARRANGEMENT_API.updateArrangement({
          width: clamp(width, MIN_WIDTH, MAX_WIDTH),
          height: clamp(height, MIN_HEIGHT, MAX_HEIGHT),
        })
        applyArrangement(data)
      } catch (error) {
        appCommonStore.showError(error)
      }
    },
    500,
  )

  function resizeWorkspace(width: number, height: number) {
    workspaceWidth.value = clamp(width, MIN_WIDTH, MAX_WIDTH)
    workspaceHeight.value = clamp(height, MIN_HEIGHT, MAX_HEIGHT)
    debouncedWorkspaceSize.call('workspace-size', workspaceWidth.value, workspaceHeight.value)
  }

  async function toggleWorkspaceShape() {
    await updateWorkspace({
      shape: workspaceShape.value === 'rect' ? 'circle' : 'rect',
    })
  }

  async function addObject(shape: SeatingShape = 'circle') {
    if (tables.value.length >= maxTablesAmount.value) {
      appCommonStore.showError(new Error('errors.seating.maxTablesReached'))
      return
    }

    try {
      const idx = tables.value.length + 1
      const created = await SEATING_ARRANGEMENT_API.createTable({
        name: defaultNameForShape(shape, idx),
        position: {
          x: clamp(160 + Math.random() * 480, 0, workspaceWidth.value),
          y: clamp(160 + Math.random() * 320, 0, workspaceHeight.value),
        },
        shape,
        rotation: 0,
        radius: DEFAULT_TABLE_RADIUS,
      })

      tables.value.push({
        id: created.id,
        name: created.name,
        x: created.position.x,
        y: created.position.y,
        radius: created.radius,
        shape: created.shape,
        rotation: created.rotation,
        guests: created.seats.map((seat) => ({
          id: seat.id,
          guestId: seat.guest_id,
          name: seat.name,
        })),
      })
    } catch (error) {
      appCommonStore.showError(error)
    }
  }

  async function updateTablePosition(id: string, x: number, y: number) {
    const table = tables.value.find((item) => item.id === id)
    if (!table) return
    table.x = x
    table.y = y
    try {
      await SEATING_ARRANGEMENT_API.updateTable(id, { position: { x, y } })
    } catch (error) {
      appCommonStore.showError(error)
    }
  }

  async function renameTable(id: string, name: string) {
    const table = tables.value.find((item) => item.id === id)
    if (!table) return
    table.name = name
    try {
      await SEATING_ARRANGEMENT_API.updateTable(id, { name })
    } catch (error) {
      appCommonStore.showError(error)
    }
  }

  async function addGuest(tableId: string, guestId: string) {
    const table = tables.value.find((item) => item.id === tableId)
    if (!table) return
    if (table.guests.length >= maxSeatsPerTableAmount.value) {
      appCommonStore.showError(new Error('errors.seating.maxSeatsPerTableReached'))
      return
    }

    try {
      const seat = await SEATING_ARRANGEMENT_API.addSeat(tableId, guestId)
      table.guests.push({ id: seat.id, guestId: seat.guest_id, name: seat.name })
    } catch (error) {
      appCommonStore.showError(error)
    }
  }

  async function removeGuest(tableId: string, seatId: string) {
    const table = tables.value.find((item) => item.id === tableId)
    if (!table) return
    try {
      await SEATING_ARRANGEMENT_API.removeSeat(tableId, seatId)
      table.guests = table.guests.filter((guest) => guest.id !== seatId)
    } catch (error) {
      appCommonStore.showError(error)
    }
  }

  async function moveGuestBetweenTables(sourceTableId: string, targetTableId: string, seatId: string) {
    if (sourceTableId === targetTableId) return

    const sourceTable = tables.value.find((item) => item.id === sourceTableId)
    const targetTable = tables.value.find((item) => item.id === targetTableId)
    if (!sourceTable || !targetTable) return
    if (sourceTable.shape === 'pillar' || targetTable.shape === 'pillar') return
    if (targetTable.guests.length >= maxSeatsPerTableAmount.value) {
      appCommonStore.showError(new Error('errors.seating.maxSeatsPerTableReached'))
      return
    }

    const sourceIndex = sourceTable.guests.findIndex((guest) => guest.id === seatId)
    if (sourceIndex === -1) return

    const guest = sourceTable.guests[sourceIndex]
    if (!guest) return

    sourceTable.guests.splice(sourceIndex, 1)
    const targetIndex = targetTable.guests.push(guest) - 1

    try {
      const createdSeat = await SEATING_ARRANGEMENT_API.addSeat(targetTableId, guest.guestId)
      await SEATING_ARRANGEMENT_API.removeSeat(sourceTableId, seatId)

      if (targetTable.guests[targetIndex]?.id === guest.id) {
        targetTable.guests[targetIndex] = {
          id: createdSeat.id,
          guestId: createdSeat.guest_id,
          name: createdSeat.name,
        }
      }
    } catch (error) {
      sourceTable.guests.splice(sourceIndex, 0, guest)

      const insertedSeat = targetTable.guests[targetIndex]
      if (insertedSeat?.guestId === guest.guestId) {
        targetTable.guests.splice(targetIndex, 1)
      } else {
        targetTable.guests = targetTable.guests.filter((item) => item.id !== guest.id)
      }

      appCommonStore.showError(error)
    }
  }

  const debouncedRotation = useDebouncedAction<string, [number]>(
    (id, rotation) => {
      SEATING_ARRANGEMENT_API.updateTable(id, { rotation })
        .catch((error) => appCommonStore.showError(error))
    },
  )

  function setTableRotation(id: string, rotation: number) {
    const table = tables.value.find((item) => item.id === id)
    if (!table) return
    table.rotation = rotation
    debouncedRotation.call(id, rotation)
  }

  const debouncedRadius = useDebouncedAction<string, [number]>(
    (id, radius) => {
      SEATING_ARRANGEMENT_API.updateTable(id, { radius })
        .catch((error) => appCommonStore.showError(error))
    },
  )

  function updateTableRadius(id: string, radius: number) {
    const table = tables.value.find((item) => item.id === id)
    if (!table) return
    table.radius = radius
    debouncedRadius.call(id, radius)
  }

  async function deleteTable(id: string) {
    try {
      await SEATING_ARRANGEMENT_API.deleteTable(id)
      tables.value = tables.value.filter((table) => table.id !== id)
    } catch (error) {
      appCommonStore.showError(error)
    }
  }

  return {
    tables,
    workspaceShape,
    workspaceWidth,
    workspaceHeight,
    maxTablesAmount,
    maxSeatsPerTableAmount,
    workspaceBounds,
    workspaceLimits,
    fetchTables,
    updateWorkspace,
    resizeWorkspace,
    toggleWorkspaceShape,
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
