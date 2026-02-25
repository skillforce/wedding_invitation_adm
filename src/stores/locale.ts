import { defineStore } from 'pinia'
import { ref } from 'vue'
import i18n, {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type AppLocale,
} from '@/i18n'

function normalizeLocale(value: string | undefined): AppLocale {
  return value === 'en' ? 'en' : 'ru'
}

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref<AppLocale>(DEFAULT_LOCALE)
  const initialized = ref(false)

  function applyLocale(nextLocale: AppLocale) {
    i18n.global.locale.value = nextLocale
    document.documentElement.lang = nextLocale
  }

  function initLocale() {
    if (initialized.value) {
      return
    }

    const normalized = normalizeLocale(locale.value)
    locale.value = normalized
    applyLocale(normalized)
    initialized.value = true
  }

  function setLocale(nextLocale: AppLocale) {
    const normalized = normalizeLocale(nextLocale)
    if (locale.value === normalized && initialized.value) {
      return
    }

    locale.value = normalized
    applyLocale(normalized)
    initialized.value = true
  }

  return {
    locale,
    availableLocales: SUPPORTED_LOCALES,
    initLocale,
    setLocale,
  }
}, {
  persist: {
    key: 'app-locale',
    pick: ['locale'],
    serializer: {
      serialize: (state) => {
        const locale = (state as { locale?: string }).locale
        return normalizeLocale(locale)
      },
      deserialize: (value) => ({
        locale: normalizeLocale(typeof value === 'string' ? value : undefined),
      }),
    },
  },
})
