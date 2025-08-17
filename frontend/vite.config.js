import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Only use proxy if no API base URL is configured
  const useProxy = !env.VITE_API_BASE_URL

  return {
    plugins: [react()],
    server: {
      port: 3000,
      ...(useProxy && {
        proxy: {
          '/api': {
            target: 'http://runnio.test',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '/backend/api')
          }
        }
      })
    }
  }
})
