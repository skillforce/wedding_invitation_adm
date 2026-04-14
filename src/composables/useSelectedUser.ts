import { ref } from 'vue'

const selectedUserId = ref<number | null>(null)

const editingUserId = ref<number | null>(null)

export function useSelectedUser() {
  return { selectedUserId, editingUserId }
}
