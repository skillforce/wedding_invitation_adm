import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Material from '@primeuix/themes/material'
import VueKonva from 'vue-konva'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import './router/guards'
import './style.css'
import 'primeicons/primeicons.css'
import { useThemeStore } from '@/stores/theme'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Material,
    options: {
      darkModeSelector: '.app-theme-dark',
    },
  },
})
app.use(VueKonva)

const themeStore = useThemeStore(pinia)
themeStore.initTheme()

app.mount('#app')
