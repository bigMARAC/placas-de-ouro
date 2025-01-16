import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    proxy: {
      '/api/maritaca': {
        target: 'https://chat.maritaca.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/maritaca/, ''),
      }
    }
  }
})
