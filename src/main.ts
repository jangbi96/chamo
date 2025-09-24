import './style/_font.scss'
import './style/main.scss'
import 'virtual:svg-icons-register'
import Icon from '@/components/Icon.vue'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { MotionPlugin } from '@vueuse/motion'
import lazyload from './directives/lazyload'
const app = createApp(App)

app.use(router)
app.use(MotionPlugin)

app.directive('lazyload', lazyload)

app.component('Icon', Icon) // 전역 등록
app.mount('#app')
