/**
 * @sylphx/silk-astro
 * Astro integration for Silk with islands architecture support
 */

import type { AstroIntegration } from 'astro'
import { cssRules } from '@sylphx/silk'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

export interface SilkAstroConfig {
  /**
   * Output CSS file
   * @default 'silk.css'
   */
  outputFile?: string

  /**
   * Enable critical CSS extraction per-page
   * @default true
   */
  criticalCSS?: boolean

  /**
   * Enable production optimizations
   * @default true in production
   */
  production?: boolean

  /**
   * Brotli pre-compression
   * @default true
   */
  brotli?: boolean

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
 *       criticalCSS: true,
 *       islands: true,
 *       brotli: true
 *     })
 *   ]
 * })
 * ```
 */
export default function silk(config: SilkAstroConfig = {}): AstroIntegration {
  const {
    outputFile = 'silk.css',
    criticalCSS = true,
    production = process.env.NODE_ENV === 'production',
    brotli = true,
    islands = true,
  } = config

  return {
    name: '@sylphx/silk-astro',
    hooks: {
      'astro:config:setup': ({ config, injectScript }) => {
        // Inject Silk client script for islands
        if (islands) {
          injectScript('page', `
            if (import.meta.hot) {
              import.meta.hot.accept()
            }
          `)
        }
      },

      'astro:build:start': async () => {
        // Clear CSS rules before build
        cssRules.clear()
      },

      'astro:build:done': async ({ dir, pages }) => {
        // Extract CSS after build
        const allCSS: string[] = []

        for (const [_, rule] of cssRules) {
          allCSS.push(rule)
        }

        const css = allCSS.join('\n')
        const outputPath = path.join(dir.pathname, outputFile)

        // Write CSS file
        await fs.writeFile(outputPath, css, 'utf-8')

        // Generate compressed versions if enabled
        if (brotli && production) {
          // Brotli compression would go here
        }

        console.log(`✅ Silk CSS extracted: ${outputPath}`)
      },

      'astro:server:setup': ({ server }) => {
        // HMR support in dev mode
        server.watcher.on('change', (file) => {
          if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            // Trigger HMR for CSS updates
            server.ws.send({
              type: 'full-reload',
            })
          }
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
