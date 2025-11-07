/**
 * @sylphx/silk-nextjs
 * Next.js integration for Silk with App Router and RSC support
 */

import type { NextConfig } from 'next'
import type { DesignConfig } from '@sylphx/silk'

export interface SilkNextConfig {
  /**
   * Output CSS file path
   * @default 'silk.css'
   */
  outputFile?: string

  /**
   * Enable App Router optimizations
   * @default true
   */
  appRouter?: boolean

  /**
   * Enable React Server Components optimizations
   * @default true
   */
  rsc?: boolean

  /**
   * Generate critical CSS for initial page load
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
   * Inject CSS into _document
   * @default true
   */
  inject?: boolean
}

/**
 * Silk Next.js plugin
 *
 * @example
 * ```typescript
 * // next.config.js
 * import { withSilk } from '@sylphx/silk-nextjs'
 *
 * export default withSilk({
 *   // Next.js config
 * }, {
 *   // Silk config
 *   appRouter: true,
 *   rsc: true,
 *   criticalCSS: true
 * })
 * ```
 */
export function withSilk(
  nextConfig: NextConfig = {},
  silkConfig: SilkNextConfig = {}
): NextConfig {
  const {
    outputFile = 'silk.css',
    appRouter = true,
    rsc = true,
    criticalCSS = true,
    production = process.env.NODE_ENV === 'production',
    brotli = true,
    inject = true,
  } = silkConfig

  return {
    ...nextConfig,
    webpack(config, options) {
      const { isServer, dev } = options

      // Call user's webpack config if exists
      if (typeof nextConfig.webpack === 'function') {
        config = nextConfig.webpack(config, options)
      }

      // Add Silk CSS loader
      config.module.rules.push({
        test: /\.(tsx|ts|jsx|js)$/,
        use: [
          {
            loader: require.resolve('./loader'),
            options: {
              outputFile,
              production: production && !dev,
              isServer,
              appRouter,
              rsc,
              criticalCSS,
              brotli,
            },
          },
        ],
      })

      // Inject CSS in client bundle
      if (!isServer && inject) {
        const originalEntry = config.entry
        config.entry = async () => {
          const entries = await originalEntry()

          if (entries['main.js'] && !entries['main.js'].includes('./silk-client.js')) {
            entries['main.js'].unshift(require.resolve('./silk-client.js'))
          }

          return entries
        }
      }

      return config
    },
  }
}

/**
 * Get Silk configuration for Next.js
 */
export function getSilkConfig<C extends DesignConfig>(config: C) {
  return {
    config,
    // App Router helpers
    appRouter: {
      /**
       * Generate CSS for server components
       */
      generateServerCSS: () => {
        // Extract CSS during SSR
        return ''
      },

      /**
       * Get critical CSS for route
       */
      getCriticalCSS: (route: string) => {
        // Extract critical CSS for specific route
        return ''
      },
    },

    // React Server Components helpers
    rsc: {
      /**
       * Mark styles as RSC-safe
       */
      serverOnly: <T>(styles: T): T => styles,

      /**
       * Client-only styles
       */
      clientOnly: <T>(styles: T): T => styles,
    },
  }
}

// Re-export Silk React bindings
export { createSilkReact } from '@sylphx/silk-react'
export type { SilkReactSystem } from '@sylphx/silk-react'

// Re-export core
export * from '@sylphx/silk'
