import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api/maritaca': {
        target: 'https://chat.maritaca.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/maritaca/, '/api/chat/completions'),
      },
      '/api': {
        target: 'https://openscriptureapi.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})
