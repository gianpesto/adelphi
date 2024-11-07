import CookieConsentVue from './plugins/CookieConsent.js'
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

createApp(App).use(CookieConsentVue).mount('#app')
