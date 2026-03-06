import { watch, onBeforeUnmount } from 'vue'
import type { Ref } from 'vue'
import Sortable from 'sortablejs'

interface DragSortOptions {
  handle?: string
  ghostClass?: string
  chosenClass?: string
  animation?: number
  group?: string | Sortable.GroupOptions
}

type ReorderCallback = (
  oldIndex: number,
  newIndex: number,
  fromEl: HTMLElement,
  toEl: HTMLElement,
) => void

export function useDragSort(
  containerRef: Ref<HTMLElement | null>,
  onReorder: ReorderCallback,
  options: DragSortOptions = {},
) {
  let sortable: Sortable | null = null

  watch(containerRef, (el) => {
    sortable?.destroy()
    sortable = null
    if (el) {
      sortable = new Sortable(el, {
        animation: options.animation ?? 150,
        handle: options.handle,
        ghostClass: options.ghostClass,
        chosenClass: options.chosenClass,
        group: options.group,
        onEnd({ oldIndex, newIndex, from, to }) {
          if (oldIndex === undefined || newIndex === undefined) return
          if (from === to && oldIndex === newIndex) return
          onReorder(oldIndex, newIndex, from as HTMLElement, to as HTMLElement)
        },
      })
    }
  })

  onBeforeUnmount(() => {
    sortable?.destroy()
  })
}
