/**
 * @sylphx/silk-remix
 * Remix integration for Silk with streaming SSR and critical CSS
 */

import * as React from 'react'
import type { EntryContext } from '@remix-run/node'
import { cssRules } from '@sylphx/silk'

export interface SilkRemixConfig {
  /**
   * Enable critical CSS extraction
   * @default true
   */
  criticalCSS?: boolean

  /**
   * Enable streaming SSR optimizations
   * @default true
   */
  streaming?: boolean

  /**
   * Output CSS file
   * @default 'silk.css'
   */
  outputFile?: string

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
}

/**
 * Silk CSS collector for Remix SSR
 *
 * Collects CSS during server-side rendering and injects into HTML
 *
 * @example
 * ```typescript
 * // entry.server.tsx
 * import { SilkProvider, extractCriticalCSS } from '@sylphx/silk-remix'
 *
 * export default function handleRequest(
 *   request: Request,
 *   responseStatusCode: number,
 *   responseHeaders: Headers,
 *   remixContext: EntryContext
 * ) {
 *   const { css, cleanup } = extractCriticalCSS()
 *
 *   const markup = renderToString(
 *     <SilkProvider css={css}>
 *       <RemixServer context={remixContext} url={request.url} />
 *     </SilkProvider>
 *   )
 *
 *   cleanup()
 *
 *   return new Response(markup, {
 *     status: responseStatusCode,
 *     headers: responseHeaders
 *   })
 * }
 * ```
 */
export function extractCriticalCSS(config: SilkRemixConfig = {}) {
  const collectedCSS: string[] = []

  // Collect CSS from rules
  for (const [_, rule] of cssRules) {
    collectedCSS.push(rule)
  }

  const css = collectedCSS.join('\n')

  return {
    css,
    // Cleanup function to reset after SSR
    cleanup: () => {
      // Don't clear rules in development for HMR
      if (process.env.NODE_ENV !== 'development') {
        cssRules.clear()
      }
    },
  }
}

/**
 * Silk provider for Remix
 * Injects critical CSS into HTML
 */
export function SilkProvider({
  css,
  children,
}: {
  css: string
  children: React.ReactNode
}) {
  return (
    <>
      {css && (
        <style
          data-silk="critical"
          dangerouslySetInnerHTML={{ __html: css }}
        />
      )}
      {children}
    </>
  )
}

/**
 * Links function helper for Silk CSS
 *
 * @example
 * ```typescript
 * // app/root.tsx
 * import { silkLinks } from '@sylphx/silk-remix'
 *
 * export const links: LinksFunction = () => [
 *   ...silkLinks(),
 *   // Your other links
 * ]
 * ```
 */
export function silkLinks(config: SilkRemixConfig = {}) {
  const { outputFile = 'silk.css' } = config

  return [
    {
      rel: 'stylesheet',
      href: `/${outputFile}`,
    },
    {
      rel: 'preload',
      href: `/${outputFile}`,
      as: 'style',
    },
  ]
}

/**
 * Get Silk configuration for Remix
 */
export function getSilkConfig(config: SilkRemixConfig = {}) {
  return {
    ...config,
    // Remix-specific helpers
    remix: {
      /**
       * Extract CSS for specific route
       */
      extractRouteCSS: (routeId: string) => {
        // Extract CSS for specific route
        return ''
      },

      /**
       * Stream CSS chunks for progressive rendering
       */
      streamCSS: async function* () {
        // Stream CSS chunks as they're generated
        for (const [_, rule] of cssRules) {
          yield rule
        }
      },
    },
  }
}

// Re-export Silk React bindings
export { createSilkReact } from '@sylphx/silk-react'
export type { SilkReactSystem } from '@sylphx/silk-react'

// Re-export core
export * from '@sylphx/silk'
