import dashboardIconUrl from '@/assets/dashboardIcon.svg'

export interface NavItem {
  label: string
  iconUrl: string
  path: string
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', iconUrl: dashboardIconUrl, path: '/dashboard' },
]