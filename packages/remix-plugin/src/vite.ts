/**
 * @sylphx/silk-remix - Vite plugin
 * Remix now uses Vite by default (Remix v2+)
 */

import { vite as silkVite, type SilkPluginOptions } from '@sylphx/silk-vite-plugin'

export interface SilkRemixOptions extends SilkPluginOptions {
  /**
   * Enable critical CSS extraction during SSR
   * @default true
   */
  criticalCSS?: boolean

  /**
   * Enable streaming SSR optimizations
   * @default true
   */
  streaming?: boolean
}

/**
 * Silk plugin for Remix (Vite-based)
 *
 * @example
 * ```typescript
 * // vite.config.ts
 * import { defineConfig } from 'vite'
 * import { vitePlugin as remix } from '@remix-run/dev'
 * import { silkPlugin } from '@sylphx/silk-remix/vite'
 *
 * export default defineConfig({
 *   plugins: [
 *     silkPlugin(), // Add BEFORE Remix plugin
 *     remix(),
 *   ],
 * })
 * ```
 */
export function silkPlugin(options: SilkRemixOptions = {}) {
  const {
    criticalCSS = true,
    streaming = true,
    ...silkOptions
  } = options

  // Use Vite plugin for zero-runtime compilation
  return silkVite(silkOptions)
}
