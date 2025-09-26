import { createRouter, createWebHistory } from 'vue-router'
import HowTo from '@/views/HowTo.vue'
import Main from '@/views/Main.vue'
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
    ],
})

export default router
