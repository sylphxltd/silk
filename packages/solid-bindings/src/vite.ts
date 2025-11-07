/**
 * @sylphx/silk-solid - Vite plugin
 */

import { vite as silkVite, type SilkPluginOptions } from '@sylphx/silk-vite-plugin'

/**
 * Silk plugin for Solid.js
 *
 * @example
 * ```typescript
 * // vite.config.ts
 * import { defineConfig } from 'vite'
 * import solidPlugin from 'vite-plugin-solid'
 * import { silkPlugin } from '@sylphx/silk-solid/vite'
 *
 * export default defineConfig({
 *   plugins: [
 *     silkPlugin(), // Add BEFORE Solid plugin
 *     solidPlugin(),
 *   ],
 * })
 * ```
 */
export function silkPlugin(options: SilkPluginOptions = {}) {
  return silkVite(options)
}
