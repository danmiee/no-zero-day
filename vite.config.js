import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProd = mode === 'production'

  return {
    plugins: [react()],

    // GitHub Pages deploys under /no-zero-day/ — must match the repo name
    base: isProd ? '/no-zero-day/' : '/',

    server: {
      // In dev, proxy /api to local Express when VITE_API_BASE_URL is not set
      proxy: env.VITE_API_BASE_URL ? {} : {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
  }
})
