import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Material from '@primeuix/themes/material'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import './router/guards'
import './style.css'
import 'primeicons/primeicons.css'
import { useThemeStore } from '@/stores/theme'
import { useLocaleStore } from '@/stores/locale'
import i18n from '@/i18n'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(PrimeVue, {
  theme: {
    preset: Material,
    options: {
      darkModeSelector: '.app-theme-dark',
    },
  },
})

const themeStore = useThemeStore(pinia)
themeStore.initTheme()
const localeStore = useLocaleStore(pinia)
localeStore.initLocale()

app.mount('#app')
