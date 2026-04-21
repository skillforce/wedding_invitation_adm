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
import i18n, {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type AppLocale,
} from '@/i18n'
import type { TimeFormat } from '@/utils/scenario/scenario.utils'

// ── Theme helpers ─────────────────────────────────────────────────────────────

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

// ── Locale helpers ────────────────────────────────────────────────────────────

function normalizeLocale(value: string | undefined): AppLocale {
  return value === 'en' ? 'en' : 'ru'
}

function applyLocale(nextLocale: AppLocale) {
  i18n.global.locale.value = nextLocale
  document.documentElement.lang = nextLocale
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const usePreferencesStore = defineStore('preferences', () => {
  const theme = ref<ThemeName>(DEFAULT_THEME)
  const locale = ref<AppLocale>(DEFAULT_LOCALE)
  const timeFormat = ref<TimeFormat>('24h')
  const themeInitialized = ref(false)
  const localeInitialized = ref(false)

  const isDarkTheme = computed(() => theme.value === AppTheme.Dark)

  function initTheme() {
    if (themeInitialized.value) {
      return
    }

    theme.value = getStoredTheme() ?? getSystemPreferredTheme()
    applyTheme(theme.value)
    themeInitialized.value = true
  }

  function setTheme(nextTheme: ThemeName) {
    if (theme.value === nextTheme && themeInitialized.value) {
      return
    }

    theme.value = nextTheme
    applyTheme(nextTheme)
    themeInitialized.value = true
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

  function initLocale() {
    if (localeInitialized.value) {
      return
    }

    const normalized = normalizeLocale(locale.value)
    locale.value = normalized
    applyLocale(normalized)
    localeInitialized.value = true
  }

  function setTimeFormat(fmt: TimeFormat) {
    timeFormat.value = fmt
  }

  function setLocale(nextLocale: AppLocale) {
    const normalized = normalizeLocale(nextLocale)
    if (locale.value === normalized && localeInitialized.value) {
      return
    }

    locale.value = normalized
    applyLocale(normalized)
    localeInitialized.value = true
  }

  return {
    theme,
    locale,
    timeFormat,
    isDarkTheme,
    availableThemes: THEME_NAMES,
    availableLocales: SUPPORTED_LOCALES,
    initTheme,
    initLocale,
    setTheme,
    toggleTheme,
    setLocale,
    setTimeFormat,
  }
}, {
  persist: [
    {
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
    {
      key: 'app-locale',
      pick: ['locale'],
      serializer: {
        serialize: (state) => {
          const loc = (state as { locale?: string }).locale
          return normalizeLocale(loc)
        },
        deserialize: (value) => ({
          locale: normalizeLocale(typeof value === 'string' ? value : undefined),
        }),
      },
    },
    {
      key: 'app-time-format',
      pick: ['timeFormat'],
      serializer: {
        serialize: (state) => {
          const fmt = (state as { timeFormat?: string }).timeFormat
          return fmt === '12h' ? '12h' : '24h'
        },
        deserialize: (value) => ({
          timeFormat: (value === '12h' ? '12h' : '24h') as TimeFormat,
        }),
      },
    },
  ],
})