import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSeatingStore } from '@/stores/seating'

export function useWorkspace() {
  const seatingStore = useSeatingStore()
  const {
    workspaceShape,
    workspaceWidth,
    workspaceHeight,
    maxTablesAmount,
    maxSeatsPerTableAmount,
    workspaceBounds,
    workspaceLimits,
  } = storeToRefs(seatingStore)

  const MIN_WIDTH = computed(() => workspaceBounds.value.minWidth)
  const MAX_WIDTH = computed(() => workspaceBounds.value.maxWidth)
  const MIN_HEIGHT = computed(() => workspaceBounds.value.minHeight)
  const MAX_HEIGHT = computed(() => workspaceBounds.value.maxHeight)

  return {
    workspaceShape,
    workspaceWidth,
    workspaceHeight,
    maxTablesAmount,
    maxSeatsPerTableAmount,
    MIN_WIDTH,
    MAX_WIDTH,
    MIN_HEIGHT,
    MAX_HEIGHT,
    MIN_TABLES_AMOUNT: computed(() => workspaceLimits.value.minTablesAmount),
    MAX_TABLES_AMOUNT: computed(() => workspaceLimits.value.maxTablesAmount),
    MIN_SEATS_PER_TABLE_AMOUNT: computed(() => workspaceLimits.value.minSeatsPerTableAmount),
    MAX_SEATS_PER_TABLE_AMOUNT: computed(() => workspaceLimits.value.maxSeatsPerTableAmount),
    toggleShape: seatingStore.toggleWorkspaceShape,
    resizeWorkspace: seatingStore.resizeWorkspace,
    updateWorkspace: seatingStore.updateWorkspace,
  }
}
