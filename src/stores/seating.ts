import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  SEATING_ARRANGEMENT_API,
  SeatingShape,
  type SeatingArrangementDto,
  type WorkspaceShape,
} from '@/api/seating-arrangement'
import { useGuestsStore } from '@/stores/guests'
import { useDebouncedAction } from '@/composables/useDebouncedAction'
import { useAppCommonStore } from '@/stores/app_common'
import { useSelectedUser } from '@/composables/useSelectedUser'
import i18n from '@/i18n'

export interface SeatingGuest {
  id: string
  guestId: string
  name: string
}

export { SeatingShape }
export type { WorkspaceShape } from '@/api/seating-arrangement'

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

function clampExtraSeats(value: number | null | undefined) {
  return Math.max(0, value ?? 0)
}

export const useSeatingStore = defineStore('seating', () => {
  const appCommonStore = useAppCommonStore()
  const guestsStore = useGuestsStore()
  const { selectedUserId } = useSelectedUser()
  const userId = () => selectedUserId.value ?? undefined

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

  const seatedGuestIds = computed(() => {
    const ids = new Set<string>()
    for (const table of tables.value) {
      for (const guest of table.guests) {
        ids.add(guest.guestId)
      }
    }
    return ids
  })

  const tableOccupiedSeatsMap = computed(() => {
    const map = new Map<string, number>()
    for (const table of tables.value) {
      let total = 0
      for (const seat of table.guests) {
        total += 1 + getGuestAdditionalSeatsByGuestId(seat.guestId)
      }
      map.set(table.id, total)
    }
    return map
  })

  function getGuestAdditionalSeatsByGuestId(guestId: string) {
    const guest = guestsStore.guestById.get(String(guestId))
    if (!guest) return 0

    const hasKids = guest.guestForm?.has_kids_attending ?? false
    const hasCouple = guest.guestForm?.ifWithCouple?.response === true

    const kidsSeats = hasKids
      ? clampExtraSeats(guest.guestForm!.amount_of_kids)
      : 0
    const coupleNotInListSeat = (hasCouple && !guest.guestForm?.ifWithCouple?.coupleId) ? 1 : 0

    // If profile already accounts for companions (spouse or kids), ignore response +1
    const plusOneSeats = (hasCouple || hasKids)
      ? 0
      : (guest.response?.plus_one ? 1 : 0)

    return kidsSeats + plusOneSeats + coupleNotInListSeat
  }

  function getGuestSeatDemandByGuestId(guestId: string) {
    return 1 + getGuestAdditionalSeatsByGuestId(guestId)
  }

  function getSeatAdditionalSeats(seat: SeatingGuest) {
    return getGuestAdditionalSeatsByGuestId(seat.guestId)
  }

  function getSeatOccupiedSeats(seat: SeatingGuest) {
    return 1 + getSeatAdditionalSeats(seat)
  }

  function getSeatDisplayName(seat: SeatingGuest) {
    const additionalSeats = getSeatAdditionalSeats(seat)
    return additionalSeats > 0 ? `${seat.name} +${additionalSeats}` : seat.name
  }

  function getTableOccupiedSeats(table: SeatingTable) {
    return tableOccupiedSeatsMap.value.get(table.id) ?? table.guests.reduce((sum, seat) => sum + getSeatOccupiedSeats(seat), 0)
  }

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

  async function fetchTables(userId?: number) {
    try {
      const data = await SEATING_ARRANGEMENT_API.getArrangement(userId)
      applyArrangement(data)
    } catch (error) {
      appCommonStore.showError(error)
    }
  }

  function defaultNameForShape(shape: SeatingShape, idx: number): string {
    if (shape === SeatingShape.Rect) return i18n.global.t('seating.defaultNewlywedTableName', { index: idx })
    if (shape === SeatingShape.Pillar) return i18n.global.t('seating.defaultPillarName', { index: idx })
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
      const data = await SEATING_ARRANGEMENT_API.updateArrangement(toArrangementPatch(patch), userId())
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
        }, userId())
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

  async function addObject(shape: SeatingShape = SeatingShape.Circle) {
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
      }, userId())

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
      await SEATING_ARRANGEMENT_API.updateTable(id, { position: { x, y } }, userId())
    } catch (error) {
      appCommonStore.showError(error)
    }
  }

  async function renameTable(id: string, name: string) {
    const table = tables.value.find((item) => item.id === id)
    if (!table) return
    table.name = name
    try {
      await SEATING_ARRANGEMENT_API.updateTable(id, { name }, userId())
    } catch (error) {
      appCommonStore.showError(error)
    }
  }

  async function addGuest(tableId: string, guestId: string) {
    const table = tables.value.find((item) => item.id === tableId)
    if (!table) return
    if (getTableOccupiedSeats(table) + getGuestSeatDemandByGuestId(guestId) > maxSeatsPerTableAmount.value) {
      appCommonStore.showError(new Error('errors.seating.maxSeatsPerTableReached'))
      return
    }

    try {
      const seat = await SEATING_ARRANGEMENT_API.addSeat(tableId, guestId, userId())
      table.guests.push({ id: seat.id, guestId: seat.guest_id, name: seat.name })
    } catch (error) {
      appCommonStore.showError(error)
    }
  }

  async function removeGuest(tableId: string, seatId: string) {
    const table = tables.value.find((item) => item.id === tableId)
    if (!table) return
    try {
      await SEATING_ARRANGEMENT_API.removeSeat(tableId, seatId, userId())
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
    if (sourceTable.shape === SeatingShape.Pillar || targetTable.shape === SeatingShape.Pillar) return

    const sourceIndex = sourceTable.guests.findIndex((guest) => guest.id === seatId)
    if (sourceIndex === -1) return

    const guest = sourceTable.guests[sourceIndex]
    if (!guest) return
    if (getTableOccupiedSeats(targetTable) + getSeatOccupiedSeats(guest) > maxSeatsPerTableAmount.value) {
      appCommonStore.showError(new Error('errors.seating.maxSeatsPerTableReached'))
      return
    }

    sourceTable.guests.splice(sourceIndex, 1)
    const targetIndex = targetTable.guests.push(guest) - 1

    try {
      const createdSeat = await SEATING_ARRANGEMENT_API.addSeat(targetTableId, guest.guestId, userId())
      SEATING_ARRANGEMENT_API.removeSeat(sourceTableId, seatId, userId())

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
      SEATING_ARRANGEMENT_API.updateTable(id, { rotation }, userId())
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
      SEATING_ARRANGEMENT_API.updateTable(id, { radius }, userId())
        .catch((error) => appCommonStore.showError(error))
    },
  )

  function updateTableRadius(id: string, radius: number) {
    const table = tables.value.find((item) => item.id === id)
    if (!table) return
    table.radius = radius
    debouncedRadius.call(id, radius)
  }

  async function autoSeat() {
    try {
      const data = await SEATING_ARRANGEMENT_API.autoSeat(userId())
      applyArrangement(data)
    } catch (error) {
      appCommonStore.showError(error)
    }
  }

  async function deleteTable(id: string) {
    try {
      await SEATING_ARRANGEMENT_API.deleteTable(id, userId())
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
    autoSeat,
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
    seatedGuestIds,
    tableOccupiedSeatsMap,
    getGuestAdditionalSeatsByGuestId,
    getGuestSeatDemandByGuestId,
    getSeatAdditionalSeats,
    getSeatOccupiedSeats,
    getSeatDisplayName,
    getTableOccupiedSeats,
  }
})
