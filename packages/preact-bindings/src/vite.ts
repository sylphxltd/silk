/**
 * @sylphx/silk-preact - Vite plugin
 */

import { vite as silkVite, type SilkPluginOptions } from '@sylphx/silk-vite-plugin'

/**
 * Silk plugin for Preact
 *
 * @example
 * ```typescript
 * // vite.config.ts
 * import { defineConfig } from 'vite'
 * import preact from '@preact/preset-vite'
 * import { silkPlugin } from '@sylphx/silk-preact/vite'
 *
 * export default defineConfig({
 *   plugins: [
 *     silkPlugin(), // Add BEFORE Preact plugin
 *     preact(),
 *   ],
 * })
 * ```
 */
export function silkPlugin(options: SilkPluginOptions = {}) {
  return silkVite(options)
}
