import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { promises as fs } from 'fs'

const extPlugin = () => ({
    name: 'chrome-ext-plugin',
    async writeBundle() {
        // Copy manifest.json
        const manifest = await fs.readFile(path.resolve(__dirname, 'manifest.json'))
        await fs.writeFile(path.resolve(__dirname, 'dist/manifest.json'), manifest)

        // Move popup.html from dist/src to dist and fix paths
        let popupHtml = await fs.readFile(path.resolve(__dirname, 'dist/src/popup.html'), 'utf-8')
        // Convert absolute paths to relative paths for Chrome extension
        popupHtml = popupHtml.replace(/src="\/popup\.js"/g, 'src="./popup.js"')
        popupHtml = popupHtml.replace(/href="\/assets\//g, 'href="./assets/')

        await fs.writeFile(path.resolve(__dirname, 'dist/popup.html'), popupHtml)

        // Copy icons folder
        const iconsDir = path.resolve(__dirname, 'icons')
        const distIconsDir = path.resolve(__dirname, 'dist/icons')
        try {
            await fs.cp(iconsDir, distIconsDir, { recursive: true })
        } catch (error) {
            console.warn('Icons folder not found, skipping...')
        }

        // Remove src folder from dist
        await fs.rm(path.resolve(__dirname, 'dist/src'), { recursive: true })

        console.log('✓ Extension files prepared with relative paths')
    },
})

export default defineConfig({
    plugins: [react(), extPlugin()],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                popup: path.resolve(__dirname, 'src/popup.html'),
            },
            output: {
                entryFileNames: '[name].js',
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
