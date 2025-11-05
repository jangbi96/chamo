import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
    server: {
        host: true, // PC IP 또는 0.0.0.0으로 열기
        port: 3000,
        proxy: {
            '/api': {
                target: 'https://admin.lightning.ai.kr',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''), // /api 제거
            },
        },
    },
    plugins: [
        vue(),
        vueDevTools(),

        createSvgIconsPlugin({
            iconDirs: [path.resolve(__dirname, 'src/assets/icons')], // 아이콘 폴더
            symbolId: 'icon-[name]',
        }),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
          @use "@/style/_mixIn.scss" as *;
        `,
            },
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
})
