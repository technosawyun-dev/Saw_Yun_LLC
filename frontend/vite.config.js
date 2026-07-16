import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['test.heinh.dev'],
    // Lets the browser call the API on the same origin it loaded the page
    // from (localhost:5173, or the test.heinh.dev tunnel from any device) —
    // Vite forwards these to the backend on this machine. Without this, a
    // device other than this one can't reach "localhost:8000" at all, since
    // that means *its own* localhost, not this machine's.
    proxy: {
      '/api': { target: 'http://localhost:8000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
})
