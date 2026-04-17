import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSelectedUserStore } from '@/stores/selectedUser'

const editingUserId = ref<number | null>(null)

export function useSelectedUser() {
  const store = useSelectedUserStore()
  const { selectedUserId } = storeToRefs(store)
  return { selectedUserId, editingUserId }
}
