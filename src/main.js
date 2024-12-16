import CookieConsentVue from './plugins/CookieConsent.js'
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

import VueGtag from 'vue-gtag'

createApp(App)
  .use(CookieConsentVue)
  .use(VueGtag, { config: { id: import.meta.env.VITE_GOOGLE_ANALYTICS_ID }, enabled: false })
  .mount('#app')
