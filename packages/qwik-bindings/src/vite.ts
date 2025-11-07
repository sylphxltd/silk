/**
 * @sylphx/silk-qwik - Vite plugin
 */

import { vite as silkVite, type SilkPluginOptions } from '@sylphx/silk-vite-plugin'

/**
 * Silk plugin for Qwik
 *
 * @example
 * ```typescript
 * // vite.config.ts
 * import { defineConfig } from 'vite'
 * import { qwikVite } from '@builder.io/qwik/optimizer'
 * import { silkPlugin } from '@sylphx/silk-qwik/vite'
 *
 * export default defineConfig({
 *   plugins: [
 *     silkPlugin(), // Add BEFORE Qwik plugin
 *     qwikVite(),
 *   ],
 * })
 * ```
 */
export function silkPlugin(options: SilkPluginOptions = {}) {
  return silkVite(options)
}
