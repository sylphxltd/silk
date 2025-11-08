import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { silkPlugin } from '@sylphx/silk-vite-plugin'

export default defineConfig({
  plugins: [
    preact(),
    silkPlugin()
  ]
})
