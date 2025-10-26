import './style/_font.scss'
import './style/main.scss'
// import 'virtual:svg-icons-register'
import { createPinia } from 'pinia'
import Icon from '@/components/Icon.vue'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { MotionPlugin } from '@vueuse/motion'
import lazyload from './directives/lazyload'
const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(MotionPlugin)
app.use(pinia)
app.directive('lazyload', lazyload)

app.component('Icon', Icon) // 전역 등록
app.mount('#app')
