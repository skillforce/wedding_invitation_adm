import { useAuthStore } from '@/stores/auth'
import { useAppCommonStore } from '@/stores/app_common'
import { navItems } from '@/components/sidebar/sidebarConfig'
import { AppRoute } from '@/constants/app'
import router from './index'

const NAV_PATH_SET = new Set(navItems.map((item) => item.path))

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  const appCommon = useAppCommonStore()

  if (!auth.isAuthChecked) {
    await auth.checkAuthOnAppOpen()
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return AppRoute.Login
  }

  if (to.path === AppRoute.Login && auth.isAuthenticated) {
    const savedPath = appCommon.selectedSidebarOption
    return NAV_PATH_SET.has(savedPath) ? savedPath : AppRoute.Guests
  }

  return true
})
