import { createI18n } from 'vue-i18n'
import en from './en.json'
import ru from './ru.json'

export const SUPPORTED_LOCALES = ['ru', 'en'] as const
export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: AppLocale = 'ru'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    en,
    ru,
  },
})

export default i18n
