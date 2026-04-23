import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSelectedUserStore = defineStore('selected-user', () => {
  const selectedUserId = ref<number | null>(null)

  function reset() {
    selectedUserId.value = null
  }

  return { selectedUserId, reset }
}, {
  persist: {
    key: 'selected-user-id',
    pick: ['selectedUserId'],
  },
})