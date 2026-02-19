import { useAuthStore } from '@/stores/auth'
import router from './index.ts'

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (!auth.isAuthChecked) {
    await auth.checkAuthOnAppOpen()
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/'
  }

  if (to.path === '/' && auth.isAuthenticated) {
    return '/dashboard'
  }

  return true
})
