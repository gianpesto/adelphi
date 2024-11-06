// import CookieConsent from 'vue-cookieconsent'
import './assets/main.css'
import '../node_modules/vue-cookieconsent/vendor/cookieconsent.css'

// const consentOptions = {}

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './index.css'

const app = createApp(App)

app
  .use(createPinia()) /* .use(CookieConsent, consentOptions) */
  .mount('#app')
