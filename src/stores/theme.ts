import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { AppTheme } from '@/constants/app'
import {
  applyTheme,
  DEFAULT_THEME,
  THEME_NAMES,
  type ThemeName,
} from '@/themes'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<ThemeName>(DEFAULT_THEME)
  const initialized = ref(false)

  const isDarkTheme = computed(() => theme.value === AppTheme.Dark)

  function initTheme() {
    if (initialized.value) {
      return
    }

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
    setTheme(theme.value === AppTheme.Dark ? AppTheme.Light : AppTheme.Dark)
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
        const theme = (state as { theme?: ThemeName }).theme
        return theme === AppTheme.Light ? AppTheme.Light : DEFAULT_THEME
      },
      deserialize: (value) => ({
        theme: value === AppTheme.Light ? AppTheme.Light : DEFAULT_THEME,
      }),
    },
  },
})
