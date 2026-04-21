export enum AppTheme {
  Dark = 'dark',
  Light = 'light',
}

export enum AppRoute {
  Login = '/',
  ConfirmEmail = '/confirm',
  Guests = '/guests',
  SeatingArrangements = '/seating-arrangements',
  Budget = '/budget',
  Checklist = '/checklist',
  MiniGame = '/mini-game',
  UserProfile = '/profile',
  UserManagement = '/user-management',
  Scenario = '/scenario',
}

export enum AppChildRoute {
  Guests = 'guests',
  SeatingArrangements = 'seating-arrangements',
  Budget = 'budget',
  Checklist = 'checklist',
  MiniGame = 'mini-game',
  UserProfile = 'profile',
  UserManagement = 'user-management',
  Scenario = 'scenario',
}

export const DEVICE_ID_KEY = 'app-device-id'
export const THEME_STORAGE_KEY = 'app-theme'
export const SIDEBAR_OPTION_STORAGE_KEY = 'sidebar-selected-option'
export const SIDEBAR_COLLAPSED_KEY = 'sidebar-collapsed'
