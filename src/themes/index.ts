import { AppTheme } from '@/constants/app'

export const THEME_STORAGE_KEY = 'app-theme'
export const THEME_NAMES = [AppTheme.Dark, AppTheme.Light] as const
export const DEFAULT_THEME = AppTheme.Dark

export type ThemeName = AppTheme

export interface ThemeDefinition {
  cssVars: Record<`--${string}`, string>
  board: {
    canvasBackground: string
    canvasDot: string
  }
  konva: {
    tableStroke: string
    tableFill: string
    seatFill: string
    seatStroke: string
    selectionStroke: string
    tableNameFill: string
    newlywedsDotFill: string
    newlywedsDotStroke: string
    guestNameFill: string
    rotationHandleLine: string
    rotationHandleFill: string
    rotationHandleStroke: string
    tableShadowColor: string
    connectorStroke: string
    canvasBorder: string
  }
}

const themes: Record<ThemeName, ThemeDefinition> = {
  [AppTheme.Dark]: {
    cssVars: {
      '--z-drawer': '40',
      '--z-drawer-backdrop': '35',
      '--z-drawer-trigger': '30',
      '--color-bg-app': '#111827',
      '--color-backdrop': 'rgba(8, 11, 16, 0.45)',
      '--color-surface': '#1a2235',
      '--color-surface-soft': '#1b2433',
      '--color-sidebar-bg': '#141923',
      '--color-border': '#2e3442',
      '--color-border-strong': '#2d3a50',
      '--color-profile-border': '#2b3446',
      '--color-text-primary': '#e4e7ef',
      '--color-text-secondary': '#c9d0dc',
      '--color-text-muted': '#8b95a8',
      '--color-text-subtle': '#97a4bd',
      '--color-text-strong': '#edf2ff',
      '--color-title': '#dce3f5',
      '--color-hover': '#242f44',
      '--color-active': '#1f2737',
      '--color-icon-filter': 'brightness(0) invert(1) opacity(0.6)',
      '--color-icon-filter-active': 'brightness(0) invert(1)',
      '--color-avatar-filter': 'brightness(0) invert(1) opacity(0.6)',
      '--color-avatar-filter-soft': 'brightness(0) invert(0.75)',
      '--color-login-gradient': 'linear-gradient(80deg, #0f1728 0%, #205d52 100%)',
      '--color-theme-switch-bg': '#1a2235',
      '--color-theme-switch-border': '#2e3442',
      '--color-theme-switch-track': '#29364d',
      '--color-theme-switch-thumb': '#8ec5b4',
      '--color-theme-switch-label': '#dce4f7',
      '--board-bg': '#1a1f2e',
      '--board-dot': 'rgba(184, 148, 63, 0.18)',
      '--board-hint': 'rgba(232, 213, 163, 0.4)',
      '--board-toolbar-bg': 'rgba(26, 31, 46, 0.88)',
      '--board-toolbar-border': 'rgba(184, 148, 63, 0.3)',
      '--board-toolbar-text': '#e8d5a3',
      '--board-panel-bg': 'rgba(18, 22, 36, 0.96)',
      '--board-panel-border': 'rgba(184, 148, 63, 0.22)',
      '--board-panel-handle': 'rgba(232, 213, 163, 0.28)',
      '--board-input-bg': 'rgba(255, 255, 255, 0.06)',
      '--board-input-border': 'rgba(184, 148, 63, 0.4)',
      '--board-input-border-focus': 'rgba(184, 148, 63, 0.85)',
      '--board-input-text': '#e8d5a3',
      '--board-close-bg': 'rgba(255, 255, 255, 0.06)',
      '--board-close-text': 'rgba(232, 213, 163, 0.55)',
      '--board-close-hover-bg': 'rgba(255, 255, 255, 0.12)',
      '--board-close-hover-text': '#e8d5a3',
      '--board-section-text': 'rgba(232, 213, 163, 0.5)',
      '--board-badge-bg': 'rgba(184, 148, 63, 0.2)',
      '--board-badge-text': '#e8d5a3',
      '--board-empty-text': 'rgba(232, 213, 163, 0.3)',
      '--board-item-bg': 'rgba(255, 255, 255, 0.04)',
      '--board-item-border': 'rgba(184, 148, 63, 0.1)',
      '--board-item-text': '#d4c4a0',
      '--board-remove-text': 'rgba(220, 130, 130, 0.45)',
      '--board-remove-hover-bg': 'rgba(220, 80, 80, 0.15)',
      '--board-remove-hover-text': '#e09090',
      '--board-guest-input-bg': 'rgba(255, 255, 255, 0.05)',
      '--board-guest-input-border': 'rgba(184, 148, 63, 0.28)',
      '--board-guest-input-focus': 'rgba(184, 148, 63, 0.7)',
      '--board-placeholder': 'rgba(232, 213, 163, 0.28)',
    },
    board: {
      canvasBackground: '#1a1f2e',
      canvasDot: 'rgba(184, 148, 63, 0.18)',
    },
    konva: {
      tableStroke: '#b8943f',
      tableFill: '#faf5ee',
      seatFill: '#f5e6e6',
      seatStroke: '#c49a9a',
      selectionStroke: '#e8d5a3',
      tableNameFill: '#573716',
      newlywedsDotFill: '#e05555',
      newlywedsDotStroke: '#b83333',
      guestNameFill: '#ffffff',
      rotationHandleLine: '#e8d5a3',
      rotationHandleFill: '#b8943f',
      rotationHandleStroke: '#e8d5a3',
      tableShadowColor: 'rgba(0, 0, 0, 0.18)',
      connectorStroke: '#b8943f',
      canvasBorder: 'rgba(184, 148, 63, 0.45)',
    },
  },
  [AppTheme.Light]: {
    cssVars: {
      '--z-drawer': '40',
      '--z-drawer-backdrop': '35',
      '--z-drawer-trigger': '30',
      '--color-bg-app': '#dee0e6',
      '--color-backdrop': 'rgba(13, 24, 39, 0.28)',
      '--color-surface': '#ffffff',
      '--color-surface-soft': '#f9fbff',
      '--color-sidebar-bg': '#e5ebf6',
      '--color-border': '#c7d1df',
      '--color-border-strong': '#cbd6e4',
      '--color-profile-border': '#c3cfde',
      '--color-text-primary': '#233244',
      '--color-text-secondary': '#455a70',
      '--color-text-muted': '#6b7f96',
      '--color-text-subtle': '#7588a0',
      '--color-text-strong': '#1a2636',
      '--color-title': '#1f3044',
      '--color-hover': '#dbe6f3',
      '--color-active': '#cfddeb',
      '--color-icon-filter': 'none',
      '--color-icon-filter-active': 'none',
      '--color-avatar-filter': 'none',
      '--color-avatar-filter-soft': 'opacity(0.72)',
      '--color-login-gradient': 'linear-gradient(80deg, #f3f4f6 0%, #76d3bd 100%)',
      '--color-theme-switch-bg': '#ffffff',
      '--color-theme-switch-border': '#c7d1df',
      '--color-theme-switch-track': '#dbe6f3',
      '--color-theme-switch-thumb': '#4f6f95',
      '--color-theme-switch-label': '#233244',
      '--board-bg': '#f5f7fb',
      '--board-dot': 'rgba(74, 95, 125, 0.22)',
      '--board-hint': 'rgba(62, 78, 100, 0.55)',
      '--board-toolbar-bg': 'rgba(255, 255, 255, 0.9)',
      '--board-toolbar-border': 'rgba(128, 149, 177, 0.45)',
      '--board-toolbar-text': '#2f4863',
      '--board-panel-bg': 'rgba(250, 252, 255, 0.96)',
      '--board-panel-border': 'rgba(128, 149, 177, 0.35)',
      '--board-panel-handle': 'rgba(92, 111, 136, 0.35)',
      '--board-input-bg': 'rgba(255, 255, 255, 0.92)',
      '--board-input-border': 'rgba(112, 136, 166, 0.45)',
      '--board-input-border-focus': 'rgba(73, 115, 164, 0.9)',
      '--board-input-text': '#28415d',
      '--board-close-bg': 'rgba(223, 231, 242, 0.75)',
      '--board-close-text': 'rgba(41, 64, 89, 0.72)',
      '--board-close-hover-bg': 'rgba(203, 218, 238, 0.95)',
      '--board-close-hover-text': '#213752',
      '--board-section-text': 'rgba(52, 75, 101, 0.75)',
      '--board-badge-bg': 'rgba(106, 139, 177, 0.26)',
      '--board-badge-text': '#29425f',
      '--board-empty-text': 'rgba(74, 92, 117, 0.5)',
      '--board-item-bg': 'rgba(228, 236, 248, 0.72)',
      '--board-item-border': 'rgba(133, 156, 184, 0.35)',
      '--board-item-text': '#2f4866',
      '--board-remove-text': 'rgba(173, 91, 91, 0.7)',
      '--board-remove-hover-bg': 'rgba(210, 114, 114, 0.25)',
      '--board-remove-hover-text': '#9e4747',
      '--board-guest-input-bg': 'rgba(255, 255, 255, 0.9)',
      '--board-guest-input-border': 'rgba(112, 136, 166, 0.4)',
      '--board-guest-input-focus': 'rgba(73, 115, 164, 0.75)',
      '--board-placeholder': 'rgba(71, 90, 114, 0.42)',
    },
    board: {
      canvasBackground: '#bdbaba',
      canvasDot: 'rgba(74, 95, 125, 0.22)',
    },
    konva: {
      tableStroke: '#7a93b3',
      tableFill: '#9c9c9c',
      seatFill: '#e6edf8',
      seatStroke: '#90a7c6',
      selectionStroke: '#4f6f95',
      tableNameFill: '#000000',
      newlywedsDotFill: '#db7575',
      newlywedsDotStroke: '#b65555',
      guestNameFill: '#000000',
      rotationHandleLine: '#5e789d',
      rotationHandleFill: '#6485b0',
      rotationHandleStroke: '#2c4a70',
      tableShadowColor: 'rgba(17, 29, 44, 0.2)',
      connectorStroke: '#7a93b3',
      canvasBorder: 'rgba(79, 111, 149, 0.45)',
    },
  },
}

export function isThemeName(value: string | null): value is ThemeName {
  return value === AppTheme.Dark || value === AppTheme.Light
}

export function getStoredTheme(): ThemeName | null {
  if (typeof window === 'undefined') {
    return null
  }

  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  return isThemeName(storedTheme) ? storedTheme : null
}

export function getInitialTheme(): ThemeName {
  return getStoredTheme() ?? DEFAULT_THEME
}

export function persistTheme(themeName: ThemeName) {
  if (typeof window === 'undefined') {
    return
  }
  localStorage.setItem(THEME_STORAGE_KEY, themeName)
}

export function getThemeDefinition(themeName: ThemeName): ThemeDefinition {
  return themes[themeName]
}

export function applyTheme(themeName: ThemeName) {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  const theme = getThemeDefinition(themeName)
  root.dataset.theme = themeName
  root.classList.toggle('app-theme-dark', themeName === AppTheme.Dark)
  root.classList.toggle('app-theme-light', themeName === AppTheme.Light)
  root.style.colorScheme = themeName === AppTheme.Dark ? AppTheme.Dark : AppTheme.Light

  for (const [cssVar, value] of Object.entries(theme.cssVars)) {
    root.style.setProperty(cssVar, value)
  }
}
