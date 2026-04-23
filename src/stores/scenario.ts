import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { SCENARIO_API } from '@/api/scenario'
import { useAppCommonStore } from '@/stores/app_common'
import { useSelectedUser } from '@/composables/useSelectedUser'
import { usePreferencesStore } from '@/stores/preferences'
import { SCENARIO_MAX_POINTS } from '@/constants/scenario'
import { createKeyedDebounce } from '@/utils/scenario/scenario.utils'
import type { ScenarioPoint, ScenarioPointIcon } from '@/types/scenario'

export const useScenarioStore = defineStore('wedding-scenario', () => {
  const { selectedUserId } = useSelectedUser()
  const points = ref<ScenarioPoint[]>([])
  const debouncedSave = createKeyedDebounce(600)

  const canAddPoint = computed(() => points.value.length < SCENARIO_MAX_POINTS)
  const remainingSlots = computed(() => SCENARIO_MAX_POINTS - points.value.length)

  async function fetchScenario(userId?: number): Promise<void> {
    const appCommon = useAppCommonStore()
    appCommon.showSpinner()
    try {
      const dto = await SCENARIO_API.getScenario(userId)
      points.value = dto.points
    } catch {
      appCommon.showError(new Error('errors.scenario.failedToLoad'))
    } finally {
      appCommon.hideSpinner()
    }
  }

  async function addPoint(data: { time: string; title: string; icon: ScenarioPointIcon; note?: string }): Promise<void> {
    if (!canAddPoint.value) {
      useAppCommonStore().showError(new Error('errors.scenario.limitReached'))
      return
    }
    const dto = await SCENARIO_API.createPoint(
      { time: data.time, title: data.title, icon: data.icon, note: data.note },
      selectedUserId.value ?? undefined,
    )
    points.value = dto.points
  }

  async function removePoint(pointId: string): Promise<void> {
    const index = points.value.findIndex((p) => p.id === pointId)
    if (index === -1) return
    const removed = points.value[index]!
    points.value.splice(index, 1)
    try {
      await SCENARIO_API.deletePoint(pointId, selectedUserId.value ?? undefined)
    } catch {
      points.value.splice(index, 0, removed)
      useAppCommonStore().showError(new Error('errors.scenario.failedToDelete'))
    }
  }

  function updatePointTime(pointId: string, time: string): void {
    const point = points.value.find((p) => p.id === pointId)
    if (point) point.time = time

    debouncedSave(`point-time-${pointId}`, async () => {
      try {
        const updated = await SCENARIO_API.updatePoint(pointId, { time }, selectedUserId.value ?? undefined)
        const idx = points.value.findIndex((p) => p.id === pointId)
        if (idx !== -1) points.value[idx] = updated
        points.value.sort((a, b) => a.time.localeCompare(b.time))
      } catch (err: unknown) {
        const msg = (err as { serverMessage?: string })?.serverMessage ?? ''
        useAppCommonStore().showError(new Error(msg || 'errors.scenario.failedToUpdate'))
      }
    })
  }

  function updatePointTitle(pointId: string, title: string): void {
    const point = points.value.find((p) => p.id === pointId)
    if (point) point.title = title

    debouncedSave(`point-title-${pointId}`, async () => {
      try {
        await SCENARIO_API.updatePoint(pointId, { title }, selectedUserId.value ?? undefined)
      } catch {
        useAppCommonStore().showError(new Error('errors.scenario.failedToUpdate'))
      }
    })
  }

  function updatePointNote(pointId: string, note: string): void {
    const point = points.value.find((p) => p.id === pointId)
    if (point) point.note = note

    debouncedSave(`point-note-${pointId}`, async () => {
      try {
        await SCENARIO_API.updatePoint(pointId, { note: note || null }, selectedUserId.value ?? undefined)
      } catch {
        useAppCommonStore().showError(new Error('errors.scenario.failedToUpdate'))
      }
    })
  }

  function updatePointIcon(pointId: string, icon: ScenarioPointIcon): void {
    const point = points.value.find((p) => p.id === pointId)
    if (point) point.icon = icon

    debouncedSave(`point-icon-${pointId}`, async () => {
      try {
        await SCENARIO_API.updatePoint(pointId, { icon }, selectedUserId.value ?? undefined)
      } catch {
        useAppCommonStore().showError(new Error('errors.scenario.failedToUpdate'))
      }
    })
  }

  async function seedScenario(): Promise<void> {
    const appCommon = useAppCommonStore()
    appCommon.showSpinner()
    try {
      const { locale } = usePreferencesStore()
      const dto = await SCENARIO_API.seedScenario(locale)
      points.value = dto.points
    } catch {
      appCommon.showError(new Error('errors.scenario.failedToSeed'))
    } finally {
      appCommon.hideSpinner()
    }
  }

  function reset() {
    points.value = []
  }

  return {
    points,
    canAddPoint,
    remainingSlots,
    fetchScenario,
    addPoint,
    removePoint,
    updatePointTime,
    updatePointTitle,
    updatePointNote,
    updatePointIcon,
    seedScenario,
    reset,
  }
})