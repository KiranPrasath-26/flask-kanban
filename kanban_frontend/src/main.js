import './index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from '@/router'
import VueTailwindDatepicker from 'vue-tailwind-datepicker'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(VueTailwindDatepicker)
  .mount('#app')
