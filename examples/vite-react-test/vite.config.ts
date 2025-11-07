import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import silk from '@sylphx/silk-vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    silk({
      babelOptions: {
        production: false, // Use dev mode for now
      },
    }),
  ],
  ssr: {
    noExternal: [],
    // Let Node.js modules be externalized
  },
  resolve: {
    conditions: ['node', 'default'],
  },
})
