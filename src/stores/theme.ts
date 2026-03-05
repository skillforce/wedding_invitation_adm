import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { AppTheme } from '@/constants/app'
import {
  applyTheme,
  DEFAULT_THEME,
  THEME_NAMES,
  isThemeName,
  type ThemeName,
} from '@/themes'

interface PersistedThemeState {
  theme?: ThemeName
}

function parsePersistedTheme(raw: string | null): ThemeName | null {
  if (!raw) {
    return null
  }

  if (isThemeName(raw)) {
    return raw
  }

  try {
    const parsed = JSON.parse(raw) as PersistedThemeState | string

    if (typeof parsed === 'string') {
      return isThemeName(parsed) ? parsed : null
    }

    return isThemeName(parsed.theme ?? null) ? parsed.theme! : null
  } catch {
    return null
  }
}

function getStoredTheme(): ThemeName | null {
  if (typeof window === 'undefined') {
    return null
  }

  return parsePersistedTheme(localStorage.getItem('app-theme'))
}

function getSystemPreferredTheme(): ThemeName {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return AppTheme.Light
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? AppTheme.Dark : AppTheme.Light
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<ThemeName>(DEFAULT_THEME)
  const initialized = ref(false)

  const isDarkTheme = computed(() => theme.value === AppTheme.Dark)

  function initTheme() {
    if (initialized.value) {
      return
    }

    theme.value = getStoredTheme() ?? getSystemPreferredTheme()
    applyTheme(theme.value)
    initialized.value = true
  }

  function setTheme(nextTheme: ThemeName) {
    if (theme.value === nextTheme && initialized.value) {
      return
    }

    theme.value = nextTheme
    applyTheme(nextTheme)
    initialized.value = true
  }

  function toggleTheme() {
    if (!document.startViewTransition) {
      setTheme(theme.value === AppTheme.Dark ? AppTheme.Light : AppTheme.Dark)
      return
    }

    document.startViewTransition(() => {
      setTheme(theme.value === AppTheme.Dark ? AppTheme.Light : AppTheme.Dark)
    })
  }

  return {
    theme,
    isDarkTheme,
    availableThemes: THEME_NAMES,
    initTheme,
    toggleTheme,
  }
}, {
  persist: {
    key: 'app-theme',
    pick: ['theme'],
    serializer: {
      serialize: (state) => {
        const persistedTheme = (state as PersistedThemeState).theme
        const safeTheme = isThemeName(persistedTheme ?? null) ? persistedTheme : DEFAULT_THEME
        return JSON.stringify({ theme: safeTheme })
      },
      deserialize: (value) => ({
        theme: parsePersistedTheme(value) ?? DEFAULT_THEME,
      }),
    },
  },
})
