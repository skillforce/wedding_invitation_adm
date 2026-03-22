import { computed, ref, watch } from 'vue'
import type { BudgetItem } from '@/types/budget'
import { useBudgetStore } from '@/stores/budget'

export function useBudgetItem(getItem: () => BudgetItem) {
  const store = useBudgetStore()

  const isEditing = ref(false)
  const editName = ref(getItem().name)
  const editNameInvalid = computed(() => !editName.value.trim())

  watch(() => getItem().name, (v) => { editName.value = v })

  function startEdit() {
    editName.value = getItem().name
    isEditing.value = true
  }

  function commitName() {
    if (editName.value.trim()) {
      store.updateItem(getItem().id, { name: editName.value.trim() })
    }
    isEditing.value = false
  }

  const deviation = computed(() => {
    const item = getItem()
    if (item.actualCost === null) return null
    return (item.actualCost + (item.deposit ?? 0)) - item.estimatedCost
  })

  return { store, isEditing, editName, editNameInvalid, startEdit, commitName, deviation }
}