import { BudgetRowType, type BudgetSection } from '@/types/budget'
import { useBudgetStore } from '@/stores/budget'

const AUTO_EXPAND_DELAY_MS = 2000

type BudgetStore = ReturnType<typeof useBudgetStore>

let activeStore: BudgetStore | null = null
let hoveredSectionId: number | null = null
let expandTimer: ReturnType<typeof setTimeout> | null = null
let listenersAttached = false

function clearExpandTimer() {
  hoveredSectionId = null

  if (expandTimer) {
    clearTimeout(expandTimer)
    expandTimer = null
  }
}

function findSection(sectionId: number): BudgetSection | undefined {
  return activeStore?.rows.find(
    (row): row is BudgetSection => row.type === BudgetRowType.Section && row.id === sectionId,
  )
}

function getPointerPosition(event: Event): { x: number; y: number } | null {
  const touchEvent = event as TouchEvent

  if (touchEvent.touches?.length) {
    const touch = touchEvent.touches[0]
    if (touch) {
      return { x: touch.clientX, y: touch.clientY }
    }
  }

  const pointerEvent = event as MouseEvent
  if (typeof pointerEvent.clientX === 'number' && typeof pointerEvent.clientY === 'number') {
    return { x: pointerEvent.clientX, y: pointerEvent.clientY }
  }

  return null
}

function getHoveredSectionId(x: number, y: number): number | null {
  const elements = typeof document.elementsFromPoint === 'function'
    ? document.elementsFromPoint(x, y)
    : [document.elementFromPoint(x, y)].filter(Boolean) as Element[]

  for (const element of elements) {
    if (!(element instanceof HTMLElement)) continue

    const sectionEl = element.closest<HTMLElement>('[data-budget-section-id]')
    const sectionId = Number(sectionEl?.dataset.budgetSectionId)

    if (Number.isFinite(sectionId)) {
      return sectionId
    }
  }

  return null
}

function handleDragHover(event: Event) {
  if (!activeStore) return

  const position = getPointerPosition(event)
  if (!position) return

  const sectionId = getHoveredSectionId(position.x, position.y)
  if (sectionId === null) {
    clearExpandTimer()
    return
  }

  const section = findSection(sectionId)
  if (!section?.collapsed) {
    clearExpandTimer()
    return
  }

  if (hoveredSectionId === sectionId) {
    return
  }

  clearExpandTimer()
  hoveredSectionId = sectionId
  expandTimer = setTimeout(() => {
    if (!activeStore) return

    activeStore.expandSection(sectionId)
    clearExpandTimer()
  }, AUTO_EXPAND_DELAY_MS)
}

function addListeners() {
  if (listenersAttached || typeof document === 'undefined') return

  document.addEventListener('dragover', handleDragHover)
  document.addEventListener('mousemove', handleDragHover)
  document.addEventListener('pointermove', handleDragHover)
  document.addEventListener('touchmove', handleDragHover)

  listenersAttached = true
}

function removeListeners() {
  if (!listenersAttached || typeof document === 'undefined') return

  document.removeEventListener('dragover', handleDragHover)
  document.removeEventListener('mousemove', handleDragHover)
  document.removeEventListener('pointermove', handleDragHover)
  document.removeEventListener('touchmove', handleDragHover)

  listenersAttached = false
}

export function startBudgetItemAutoExpand(store: BudgetStore) {
  activeStore = store
  clearExpandTimer()
  addListeners()
}

export function stopBudgetItemAutoExpand() {
  clearExpandTimer()
  removeListeners()
  activeStore = null
}
