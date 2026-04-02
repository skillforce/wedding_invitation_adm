import guestsIconUrl from '@/assets/guestsIcon.svg'
import seatingsIconUrl from '@/assets/seatings.svg'
import budgetIconUrl from '@/assets/budget.svg'
import checklistIconUrl from '@/assets/checklist.svg'
import gamepadIconUrl from '@/assets/gamepad.svg'
import personIconUrl from '@/assets/person.svg'
import { AppRoute } from '@/constants/app'

export interface NavItem {
  labelKey: string
  iconUrl: string
  path: string
}

export const navItems: NavItem[] = [
  { labelKey: 'nav.profile', iconUrl: personIconUrl, path: AppRoute.UserProfile },
  { labelKey: 'nav.guests', iconUrl: guestsIconUrl, path: AppRoute.Guests },
  { labelKey: 'nav.seatingArrangements', iconUrl: seatingsIconUrl, path: AppRoute.SeatingArrangements },
  { labelKey: 'nav.budget', iconUrl: budgetIconUrl, path: AppRoute.Budget },
  { labelKey: 'nav.checklist', iconUrl: checklistIconUrl, path: AppRoute.Checklist },
]

export const miniGameNavItem: NavItem = {
  labelKey: 'nav.miniGame',
  iconUrl: gamepadIconUrl,
  path: AppRoute.MiniGame,
}
