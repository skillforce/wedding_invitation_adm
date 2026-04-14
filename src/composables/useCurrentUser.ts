import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useCurrentUser() {
  const authStore = useAuthStore()

  const isSuperUser = computed(() => authStore.user?.profile.isSuperUser ?? false)
  const isCreatedBySuperUser = computed(() => authStore.user?.profile.isCreatedBySuperUser ?? false)

  return { isSuperUser, isCreatedBySuperUser }
}