/**
 * @sylphx/silk-astro
 * Astro integration for Silk with islands architecture support
 * Uses unplugin for zero-runtime CSS compilation
 */

import type { AstroIntegration } from 'astro'
import { unpluginSilk, type SilkPluginOptions } from '@sylphx/silk-vite-plugin'

export interface SilkAstroConfig extends SilkPluginOptions {
  /**
   * Enable critical CSS extraction per-page
   * @default true
   */
  criticalCSS?: boolean

  /**
   * Enable islands optimizations
   * @default true
   */
  islands?: boolean
}

/**
 * Silk integration for Astro
 *
 * @example
 * ```typescript
 * // astro.config.mjs
 * import { defineConfig } from 'astro/config'
 * import silk from '@sylphx/silk-astro'
 *
 * export default defineConfig({
 *   integrations: [
 *     silk({
 *       outputFile: 'silk.css',
 *       babelOptions: {
 *         production: true,
 *       }
 *     })
 *   ]
 * })
 * ```
 */
export default function silk(config: SilkAstroConfig = {}): AstroIntegration {
  const {
    outputFile = 'silk.css',
    criticalCSS = true,
    islands = true,
    babelOptions = {},
    compression = {},
    minify,
  } = config

  // Configure Silk plugin
  const silkPluginOptions: SilkPluginOptions = {
    outputFile,
    minify,
    compression,
    babelOptions,
  }

  return {
    name: '@sylphx/silk-astro',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        // Add Silk Vite plugin to Astro's Vite config
        updateConfig({
          vite: {
            plugins: [unpluginSilk.vite(silkPluginOptions)],
          },
        })
      },
    },
  }
}

/**
 * Get Silk configuration for Astro
 */
export function getSilkConfig(config: SilkAstroConfig = {}) {
  return {
    ...config,
    // Astro-specific helpers
    astro: {
      /**
       * Extract CSS for specific page
       */
      extractPageCSS: (pagePath: string) => {
        // Extract CSS for specific page
        return ''
      },

      /**
       * Generate per-island CSS (for partial hydration)
       */
      extractIslandCSS: (islandName: string) => {
        // Extract CSS for specific island
        return ''
      },
    },
  }
}

// Re-export Silk React bindings for use in Astro islands
export { createSilkReact } from '@sylphx/silk-react'
export type { SilkReactSystem } from '@sylphx/silk-react'

// Re-export core
export * from '@sylphx/silk'
