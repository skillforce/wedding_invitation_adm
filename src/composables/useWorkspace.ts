import { ref, watch } from 'vue'

const MIN_WIDTH = 1600
const MIN_HEIGHT = 900
const MAX_RESIZE_SCALE = 1.7

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

const workspaceShape = ref<'rect' | 'circle'>(
  (localStorage.getItem('ws-shape') as 'rect' | 'circle') ?? 'rect',
)
const workspaceWidth = ref<number>(
  clamp(Number(localStorage.getItem('ws-width')) || MIN_WIDTH, MIN_WIDTH, MIN_WIDTH * MAX_RESIZE_SCALE),
)
const workspaceHeight = ref<number>(
  clamp(Number(localStorage.getItem('ws-height')) || MIN_HEIGHT, MIN_HEIGHT, MIN_HEIGHT * MAX_RESIZE_SCALE),
)

watch(workspaceShape, (v) => localStorage.setItem('ws-shape', v))
watch(workspaceWidth, (v) => localStorage.setItem('ws-width', String(v)))
watch(workspaceHeight, (v) => localStorage.setItem('ws-height', String(v)))

export function useWorkspace() {
  function toggleShape() {
    workspaceShape.value = workspaceShape.value === 'rect' ? 'circle' : 'rect'
  }

  function resizeWorkspace(w: number, h: number) {
    workspaceWidth.value = clamp(w, MIN_WIDTH, MIN_WIDTH * MAX_RESIZE_SCALE)
    workspaceHeight.value = clamp(h, MIN_HEIGHT, MIN_HEIGHT * MAX_RESIZE_SCALE)
  }

  return {
    workspaceShape,
    workspaceWidth,
    workspaceHeight,
    MIN_WIDTH,
    MIN_HEIGHT,
    MAX_RESIZE_SCALE,
    toggleShape,
    resizeWorkspace,
  }
}