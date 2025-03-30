import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
    server: {
    proxy: {
      "/api": {
        target: "http://coffeeshopmanager.42web.io/backend",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
