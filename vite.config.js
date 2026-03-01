import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
    plugins: [tailwindcss()],
    appType: 'mpa',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                study: resolve(__dirname, 'study-in-germany/index.html'),
                chancenkarte: resolve(__dirname, 'chancenkarte/index.html'),
                ausbildung: resolve(__dirname, 'ausbildung/index.html'),
                aupair: resolve(__dirname, 'au-pair/index.html'),
                packages: resolve(__dirname, 'packages/index.html'),
                about: resolve(__dirname, 'about/index.html'),
                contact: resolve(__dirname, 'contact/index.html'),
                assessment: resolve(__dirname, 'assessment/index.html'),
                apply: resolve(__dirname, 'apply/index.html'),
            },
        },
    },
})
