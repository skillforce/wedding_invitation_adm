import dashboardIconUrl from '@/assets/dashboardIcon.svg'
import seatingsIconUrl from '@/assets/seatings.svg'
import { AppRoute } from '@/constants/app'

export interface NavItem {
  label: string
  iconUrl: string
  path: string
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', iconUrl: dashboardIconUrl, path: AppRoute.Dashboard },
  { label: 'Seating Arrangements', iconUrl: seatingsIconUrl, path: AppRoute.SeatingArrangements },
]
