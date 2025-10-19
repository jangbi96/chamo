import { createRouter, createWebHistory } from 'vue-router'
import HowTo from '@/views/HowTo.vue'
import Main from '@/views/Main.vue'
import Success from '@/views/Success.vue'
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior() {
        return { top: 0 }
    },
    routes: [
        {
            path: '/howto',
            name: 'howto',
            component: HowTo,
        },
        {
            path: '/main',
            name: 'main',
            component: Main,
        },
        {
            path: '/success',
            name: 'success',
            component: Success,
        },
        {
            path: '/success',
            name: 'success',
            component: Success,
        },
    ],
})

export default router
