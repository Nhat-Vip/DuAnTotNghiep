import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
    server: {
    proxy: {
      "/api": {
        // target: "https://php-api-backend.onrender.com",
        target: "http://coffee.local",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
