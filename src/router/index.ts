import { createRouter, createWebHistory } from 'vue-router'
import Main from '@/views/Main.vue'
import Overview from '@/views/Overview.vue'
import About from '@/views/About.vue'
import Experience from '@/views/Experience.vue'
import Hearing from '@/views/Hearing.vue'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior() {
        return { top: 0 }
    },
    routes: [
        { path: '/:pathMatch(.*)', component: NotFound },
        {
            path: '/',
            name: 'home',
            component: Main,
        },
    ],
})

export default router
