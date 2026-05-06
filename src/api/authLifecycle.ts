import type { Pinia } from 'pinia'
import type { Router } from 'vue-router'
import { AppRoute } from '@/constants/app'
import { AUTH_API } from '@/api/auth'
import { configureApiAuth } from '@/api/consts'
import { useAuthStore } from '@/stores/auth'

export function installApiAuth(pinia: Pinia, router: Router): void {
  const authStore = useAuthStore(pinia)

  configureApiAuth(
    async () => {
      const token = await AUTH_API.refresh()
      authStore.token = token
      return token
    },
    async () => {
      await authStore.logout()
      await router.push(AppRoute.Login)
    },
  )
}
