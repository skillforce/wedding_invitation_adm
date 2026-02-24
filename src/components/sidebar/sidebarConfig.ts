import dashboardIconUrl from '@/assets/dashboardIcon.svg'
import seatingsIconUrl from '@/assets/seatings.svg'

export interface NavItem {
  label: string
  iconUrl: string
  path: string
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', iconUrl: dashboardIconUrl, path: '/dashboard' },
  { label: 'Seating Arrangements', iconUrl: seatingsIconUrl, path: '/seating-arrangements' },
]