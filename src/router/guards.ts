import { useAuthStore } from '@/stores/auth'
import { useAppCommonStore } from '@/stores/app_common'
import { useSelectedUserStore } from '@/stores/selectedUser'
import { navItems } from '@/components/sidebar/sidebarConfig'
import { AppRoute } from '@/constants/app'
import router from './index'

const NAV_PATH_SET = new Set(navItems.map((item) => item.path))

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  const appCommon = useAppCommonStore()
  const isPublicRoute = to.path === AppRoute.Login || to.path === AppRoute.ConfirmEmail

  if (!auth.isAuthChecked) {
    await auth.checkAuthOnAppOpen()
    if (!auth.user?.profile.isSuperUser) {
      useSelectedUserStore().selectedUserId = null
    }
  }

  if (!isPublicRoute && !auth.isAuthenticated) {
    return { path: AppRoute.Login, replace: true }
  }

  if (to.path === AppRoute.Login && auth.isAuthenticated) {
    const savedPath = appCommon.selectedSidebarOption
    const defaultPath = auth.user?.profile.isSuperUser ? AppRoute.UserManagement : AppRoute.Guests
    return NAV_PATH_SET.has(savedPath) ? savedPath : defaultPath
  }

  return true
})

router.beforeResolve((to, from, next) => {
  if (!document.startViewTransition) {
    next()
    return
  }

  document.startViewTransition(() => next())
})
