import guestsIconUrl from '@/assets/guestsIcon.svg'
import seatingsIconUrl from '@/assets/seatings.svg'
import { AppRoute } from '@/constants/app'

export interface NavItem {
  labelKey: string
  iconUrl: string
  path: string
}

export const navItems: NavItem[] = [
  { labelKey: 'nav.guests', iconUrl: guestsIconUrl, path: AppRoute.Guests },
  { labelKey: 'nav.seatingArrangements', iconUrl: seatingsIconUrl, path: AppRoute.SeatingArrangements },
]
