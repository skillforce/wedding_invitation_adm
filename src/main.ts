import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Material from '@primeuix/themes/material'
import VueKonva from 'vue-konva'
import App from './App.vue'
import router from './router'
import './router/guards'
import './style.css'
import 'primeicons/primeicons.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, { theme: { preset: Material } })
app.use(VueKonva)
app.mount('#app')
