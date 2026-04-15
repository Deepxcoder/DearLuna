import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: false,
    watch: {
      ignored: ['**/backend/**', '**/node_modules/**', '**/.git/**'],
    },
  },
  build: {
    commonjsOptions: {
      exclude: ['backend/**', 'Stitch/**'],
    },
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          'phosphor-icons': ['@phosphor-icons/react'],
          'recharts': ['recharts'],
          'framer-motion': ['framer-motion'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['@phosphor-icons/react', 'recharts', 'framer-motion'],
  }
})

