import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

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

const STORAGE_KEY = 'wedding-checklist-v3'

function buildDefaultPhases(): Phase[] {
  return [
    {
      id: 'p1',
      name: '',
      timeline: '12–10 months before',
      icon: 'pi pi-sparkles',
      tasks: [],
    },
    {
      id: 'p2',
      name: '',
      timeline: '9–7 months before',
      icon: 'pi pi-users',
      tasks: [],
    },
    {
      id: 'p3',
      name: '',
      timeline: '6–4 months before',
      icon: 'pi pi-palette',
      tasks: [],
    },
    {
      id: 'p4',
      name: '',
      timeline: '3–1 months before',
      icon: 'pi pi-clock',
      tasks: [],
    },
    {
      id: 'p5',
      name: '',
      timeline: 'Last 7 days',
      icon: 'pi pi-heart',
      tasks: [],
    },
  ]
}

function normalizeTask(rawTask: unknown): Task | null {
  if (!rawTask || typeof rawTask !== 'object') return null

  const task = rawTask as {
    id?: unknown
    title?: unknown
    note?: unknown
    completed?: unknown
    priority?: unknown
    comment?: unknown
  }

  const title = typeof task.title === 'string' ? task.title.trim() : ''
  if (!title) return null

  return {
    id: typeof task.id === 'string' ? task.id : `task-${Date.now()}`,
    title,
    note: typeof task.note === 'string' ? task.note.trim() : '',
    completed: Boolean(task.completed),
    priority: task.priority === 'high' ? 'high' : 'normal',
    comment: typeof task.comment === 'string' && task.comment.trim() ? task.comment.trim() : undefined,
  }
}

function normalizePhase(rawPhase: unknown): Phase | null {
  if (!rawPhase || typeof rawPhase !== 'object') return null

  const phase = rawPhase as {
    id?: unknown
    name?: unknown
    timeline?: unknown
    icon?: unknown
    tasks?: unknown
  }

  const phaseId = typeof phase.id === 'string' ? phase.id : `custom-${Date.now()}`
  const defaultPhase = buildDefaultPhases().find((item) => item.id === phaseId)

  return {
    id: phaseId,
    name: typeof phase.name === 'string' ? phase.name.trim() : defaultPhase?.name ?? '',
    timeline: typeof phase.timeline === 'string' ? phase.timeline.trim() : defaultPhase?.timeline ?? '',
    icon: typeof phase.icon === 'string' && phase.icon ? phase.icon : defaultPhase?.icon ?? 'pi pi-sparkles',
    tasks: Array.isArray(phase.tasks)
      ? phase.tasks.map(normalizeTask).filter((task): task is Task => task !== null)
      : [],
  }
}

function loadStoredPhases(): Phase[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    const savedPhases = Array.isArray(parsed) ? parsed : parsed.phases
    if (!Array.isArray(savedPhases)) return null

    return savedPhases
      .map(normalizePhase)
      .filter((phase): phase is Phase => phase !== null)
  } catch {
    return null
  }
}

function loadState(): Phase[] {
  const defaults = buildDefaultPhases()
  const storedPhases = loadStoredPhases()
  if (!storedPhases) return defaults

  const storedById = new Map(storedPhases.map((phase) => [phase.id, phase]))
  const mergedDefaults = defaults.map((defaultPhase) => storedById.get(defaultPhase.id) ?? defaultPhase)
  const customPhases = storedPhases.filter((phase) => !defaults.some((defaultPhase) => defaultPhase.id === phase.id))

  return [...mergedDefaults, ...customPhases]
}

export const useChecklistStore = defineStore('wedding-checklist', () => {
  const phases = ref<Phase[]>(loadState())

  watch(
    phases,
    (value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ phases: value }))
    },
    { deep: true },
  )

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

  function toggleTask(phaseId: string, taskId: string) {
    const phase = phases.value.find((item) => item.id === phaseId)
    if (!phase) return
    const task = phase.tasks.find((item) => item.id === taskId)
    if (!task) return
    task.completed = !task.completed
  }

  function renamePhase(phaseId: string, name: string) {
    const phase = phases.value.find((item) => item.id === phaseId)
    if (phase) phase.name = name.trim()
  }

  function updatePhaseTimeline(phaseId: string, timeline: string) {
    const phase = phases.value.find((item) => item.id === phaseId)
    if (phase) phase.timeline = timeline.trim()
  }

  function updatePhaseIcon(phaseId: string, icon: string) {
    const phase = phases.value.find((item) => item.id === phaseId)
    if (phase) phase.icon = icon
  }

  function removePhase(phaseId: string) {
    phases.value = phases.value.filter((phase) => phase.id !== phaseId)
  }

  function addPhase(name: string, icon: string) {
    phases.value.push({
      id: `custom-${Date.now()}`,
      name: name.trim(),
      timeline: '',
      icon,
      tasks: [],
    })
  }

  function addTask(phaseId: string, title: string) {
    const phase = phases.value.find((item) => item.id === phaseId)
    if (!phase) return
    phase.tasks.push({
      id: `task-${Date.now()}`,
      title: title.trim(),
      note: '',
      completed: false,
      priority: 'normal',
    })
  }

  function removeTask(phaseId: string, taskId: string) {
    const phase = phases.value.find((item) => item.id === phaseId)
    if (!phase) return
    phase.tasks = phase.tasks.filter((task) => task.id !== taskId)
  }

  function updateTaskTitle(phaseId: string, taskId: string, title: string) {
    const phase = phases.value.find((item) => item.id === phaseId)
    if (!phase) return
    const task = phase.tasks.find((item) => item.id === taskId)
    if (task) task.title = title
  }

  function updateTaskNote(phaseId: string, taskId: string, note: string) {
    const phase = phases.value.find((item) => item.id === phaseId)
    if (!phase) return
    const task = phase.tasks.find((item) => item.id === taskId)
    if (task) task.note = note
  }

  function updateTaskComment(phaseId: string, taskId: string, comment: string) {
    const phase = phases.value.find((item) => item.id === phaseId)
    if (!phase) return
    const task = phase.tasks.find((item) => item.id === taskId)
    if (task) task.comment = comment || undefined
  }

  function togglePriority(phaseId: string, taskId: string) {
    const phase = phases.value.find((item) => item.id === phaseId)
    if (!phase) return
    const task = phase.tasks.find((item) => item.id === taskId)
    if (!task) return
    task.priority = task.priority === 'high' ? 'normal' : 'high'
  }

  function moveTask(fromPhaseId: string, toPhaseId: string, fromIndex: number, toIndex: number) {
    const fromPhase = phases.value.find((item) => item.id === fromPhaseId)
    const toPhase = phases.value.find((item) => item.id === toPhaseId)
    if (!fromPhase || !toPhase) return
    const [task] = fromPhase.tasks.splice(fromIndex, 1)
    if (!task) return
    toPhase.tasks.splice(toIndex, 0, task)
  }

  function resetAll() {
    phases.value = buildDefaultPhases()
  }

  return {
    phases,
    allTasks,
    totalCount,
    doneCount,
    donePct,
    highTotal,
    highDone,
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
