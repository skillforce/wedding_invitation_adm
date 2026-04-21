import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { CHECKLIST_API } from '@/api/checklist'
import type { ChecklistPhaseDto, ChecklistItemDto } from '@/api/checklist'
import { useAppCommonStore } from '@/stores/app_common'
import { usePreferencesStore } from '@/stores/preferences'
import { useSelectedUser } from '@/composables/useSelectedUser'
import { createKeyedDebounce } from '@/utils/scenario/scenario.utils'

export interface Task {
  id: string
  title: string
  note: string
  completed: boolean
  priority: 'high' | 'normal'
  comment?: string
}

export interface Phase {
  id: string
  name: string
  timeline: string
  icon: string
  tasks: Task[]
}

function mapItem(item: ChecklistItemDto): Task {
  return {
    id: item.id,
    title: item.title,
    note: item.note ?? '',
    comment: item.comment ?? undefined,
    completed: item.completed,
    priority: item.priority,
  }
}

function mapPhase(phase: ChecklistPhaseDto): Phase {
  return {
    id: phase.id,
    name: phase.name ?? '',
    timeline: phase.timeline ?? '',
    icon: phase.icon ?? 'pi pi-sparkles',
    tasks: phase.items.map(mapItem),
  }
}


export const useChecklistStore = defineStore('wedding-checklist', () => {
  const { selectedUserId } = useSelectedUser()

  const phases = ref<Phase[]>([])
  const debouncedSave = createKeyedDebounce(600)

  const allTasks = computed(() => phases.value.flatMap((phase) => phase.tasks))
  const totalCount = computed(() => allTasks.value.length)
  const doneCount = computed(() => allTasks.value.filter((task) => task.completed).length)
  const donePct = computed(() =>
    totalCount.value ? Math.round((doneCount.value / totalCount.value) * 100) : 0,
  )
  const highTotal = computed(() => allTasks.value.filter((task) => task.priority === 'high').length)
  const highDone = computed(
    () => allTasks.value.filter((task) => task.priority === 'high' && task.completed).length,
  )

  async function fetchChecklist(userId?: number): Promise<void> {
    const appCommon = useAppCommonStore()
    appCommon.showSpinner()
    try {
      const { locale } = usePreferencesStore()
      const dto = await CHECKLIST_API.getChecklist(locale, userId)
      phases.value = dto.phases.map(mapPhase)
    } catch {
      appCommon.showError(new Error('errors.checklist.failedToLoad'))
    } finally {
      appCommon.hideSpinner()
    }
  }

  async function toggleTask(phaseId: string, taskId: string): Promise<void> {
    const phase = phases.value.find((p) => p.id === phaseId)
    if (!phase) return
    const task = phase.tasks.find((t) => t.id === taskId)
    if (!task) return

    task.completed = !task.completed
    try {
      const result = await CHECKLIST_API.toggleItem(phaseId, taskId, selectedUserId.value ?? undefined)
      task.completed = result.completed
    } catch {
      task.completed = !task.completed
      useAppCommonStore().showError(new Error('errors.checklist.failedToUpdate'))
    }
  }

  function renamePhase(phaseId: string, name: string): void {
    const phase = phases.value.find((p) => p.id === phaseId)
    if (phase) phase.name = name.trim()

    const userId = selectedUserId.value ?? undefined
    debouncedSave(`phase-name-${phaseId}`, async () => {
      try {
        await CHECKLIST_API.updatePhase(phaseId, { name: name.trim() || null }, userId)
      } catch {
        useAppCommonStore().showError(new Error('errors.checklist.failedToUpdate'))
      }
    })
  }

  function updatePhaseTimeline(phaseId: string, timeline: string): void {
    const phase = phases.value.find((p) => p.id === phaseId)
    if (phase) phase.timeline = timeline.trim()

    const userId = selectedUserId.value ?? undefined
    debouncedSave(`phase-timeline-${phaseId}`, async () => {
      try {
        await CHECKLIST_API.updatePhase(phaseId, { timeline: timeline.trim() || null }, userId)
      } catch {
        useAppCommonStore().showError(new Error('errors.checklist.failedToUpdate'))
      }
    })
  }

  function updatePhaseIcon(phaseId: string, icon: string): void {
    const phase = phases.value.find((p) => p.id === phaseId)
    if (phase) phase.icon = icon

    const userId = selectedUserId.value ?? undefined
    debouncedSave(`phase-icon-${phaseId}`, async () => {
      try {
        await CHECKLIST_API.updatePhase(phaseId, { icon }, userId)
      } catch {
        useAppCommonStore().showError(new Error('errors.checklist.failedToUpdate'))
      }
    })
  }

  async function removePhase(phaseId: string): Promise<void> {
    const index = phases.value.findIndex((p) => p.id === phaseId)
    if (index === -1) return

    const removed = phases.value[index]
    if (!removed) return
    phases.value.splice(index, 1)
    try {
      await CHECKLIST_API.deletePhase(phaseId, selectedUserId.value ?? undefined)
    } catch {
      phases.value.splice(index, 0, removed)
      useAppCommonStore().showError(new Error('errors.checklist.failedToDeletePhase'))
    }
  }

  async function addPhase(name: string, icon: string): Promise<void> {
    const appCommon = useAppCommonStore()
    appCommon.showSpinner()
    try {
      const dto = await CHECKLIST_API.createPhase({ name: name.trim(), icon }, selectedUserId.value ?? undefined)
      phases.value.push(mapPhase(dto))
    } catch {
      appCommon.showError(new Error('errors.checklist.failedToCreatePhase'))
    } finally {
      appCommon.hideSpinner()
    }
  }

  async function addTask(phaseId: string, title: string): Promise<void> {
    const appCommon = useAppCommonStore()
    appCommon.showSpinner()
    try {
      const dto = await CHECKLIST_API.createItem(phaseId, { title: title.trim() }, selectedUserId.value ?? undefined)
      const phase = phases.value.find((p) => p.id === phaseId)
      if (phase) phase.tasks.push(mapItem(dto))
    } catch {
      appCommon.showError(new Error('errors.checklist.failedToCreateTask'))
    } finally {
      appCommon.hideSpinner()
    }
  }

  async function removeTask(phaseId: string, taskId: string): Promise<void> {
    const phase = phases.value.find((p) => p.id === phaseId)
    if (!phase) return

    const index = phase.tasks.findIndex((t) => t.id === taskId)
    if (index === -1) return

    const removed = phase.tasks[index]
    if (!removed) return
    phase.tasks.splice(index, 1)
    try {
      await CHECKLIST_API.deleteItem(phaseId, taskId, selectedUserId.value ?? undefined)
    } catch {
      phase.tasks.splice(index, 0, removed)
      useAppCommonStore().showError(new Error('errors.checklist.failedToDeleteTask'))
    }
  }

  function updateTaskTitle(phaseId: string, taskId: string, title: string): void {
    const phase = phases.value.find((p) => p.id === phaseId)
    if (!phase) return
    const task = phase.tasks.find((t) => t.id === taskId)
    if (task) task.title = title

    const userId = selectedUserId.value ?? undefined
    debouncedSave(`task-title-${taskId}`, async () => {
      try {
        await CHECKLIST_API.updateItem(phaseId, taskId, { title }, userId)
      } catch {
        useAppCommonStore().showError(new Error('errors.checklist.failedToUpdate'))
      }
    })
  }

  function updateTaskNote(phaseId: string, taskId: string, note: string): void {
    const phase = phases.value.find((p) => p.id === phaseId)
    if (!phase) return
    const task = phase.tasks.find((t) => t.id === taskId)
    if (task) task.note = note

    const userId = selectedUserId.value ?? undefined
    debouncedSave(`task-note-${taskId}`, async () => {
      try {
        await CHECKLIST_API.updateItem(phaseId, taskId, { note: note || null }, userId)
      } catch {
        useAppCommonStore().showError(new Error('errors.checklist.failedToUpdate'))
      }
    })
  }

  function updateTaskComment(phaseId: string, taskId: string, comment: string): void {
    const phase = phases.value.find((p) => p.id === phaseId)
    if (!phase) return
    const task = phase.tasks.find((t) => t.id === taskId)
    if (task) task.comment = comment || undefined

    const userId = selectedUserId.value ?? undefined
    debouncedSave(`task-comment-${taskId}`, async () => {
      try {
        await CHECKLIST_API.updateItem(phaseId, taskId, { comment: comment || null }, userId)
      } catch {
        useAppCommonStore().showError(new Error('errors.checklist.failedToUpdate'))
      }
    })
  }

  async function togglePriority(phaseId: string, taskId: string): Promise<void> {
    const phase = phases.value.find((p) => p.id === phaseId)
    if (!phase) return
    const task = phase.tasks.find((t) => t.id === taskId)
    if (!task) return

    const newPriority: 'high' | 'normal' = task.priority === 'high' ? 'normal' : 'high'
    task.priority = newPriority
    try {
      await CHECKLIST_API.updateItem(phaseId, taskId, { priority: newPriority }, selectedUserId.value ?? undefined)
    } catch {
      task.priority = newPriority === 'high' ? 'normal' : 'high'
      useAppCommonStore().showError(new Error('errors.checklist.failedToUpdate'))
    }
  }

  async function moveTask(
    fromPhaseId: string,
    toPhaseId: string,
    fromIndex: number,
    toIndex: number,
  ): Promise<void> {
    const fromPhase = phases.value.find((p) => p.id === fromPhaseId)
    const toPhase = phases.value.find((p) => p.id === toPhaseId)
    if (!fromPhase || !toPhase) return

    const [task] = fromPhase.tasks.splice(fromIndex, 1)
    if (!task) return
    toPhase.tasks.splice(toIndex, 0, task)

    try {
      await CHECKLIST_API.moveItem(
        { itemId: task.id, targetPhaseId: toPhaseId, targetIndex: toIndex },
        selectedUserId.value ?? undefined,
      )
    } catch {
      toPhase.tasks.splice(toIndex, 1)
      fromPhase.tasks.splice(fromIndex, 0, task)
      useAppCommonStore().showError(new Error('errors.checklist.failedToUpdate'))
    }
  }

  async function resetAll(): Promise<void> {
    const appCommon = useAppCommonStore()
    appCommon.showSpinner()
    try {
      const { locale } = usePreferencesStore()
      const dto = await CHECKLIST_API.resetChecklist(locale)
      phases.value = dto.phases.map(mapPhase)
    } catch {
      appCommon.showError(new Error('errors.checklist.failedToReset'))
    } finally {
      appCommon.hideSpinner()
    }
  }

  return {
    phases,
    allTasks,
    totalCount,
    doneCount,
    donePct,
    highTotal,
    highDone,
    fetchChecklist,
    toggleTask,
    renamePhase,
    updatePhaseTimeline,
    updatePhaseIcon,
    removePhase,
    addPhase,
    addTask,
    removeTask,
    updateTaskTitle,
    updateTaskNote,
    updateTaskComment,
    togglePriority,
    moveTask,
    resetAll,
  }
})
