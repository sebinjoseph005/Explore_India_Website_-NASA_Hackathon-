import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Allows external access
    open: true, // Automatically opens browser
    cors: true, // Enable CORS
  },
  // Add this for better CSS handling
  css: {
    devSourcemap: true, // Generate sourcemaps for CSS
  },
})