/**
 * @sylphx/silk-vite-plugin
 * Vite plugin for zero-runtime Silk CSS-in-TypeScript
 *
 * Uses @sylphx/babel-plugin-silk for build-time compilation
 */

import type { Plugin, ViteDevServer } from 'vite'
import type { SilkMetadata } from '@sylphx/babel-plugin-silk'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { gzipSync } from 'node:zlib'

export interface CompressionOptions {
  /**
   * Enable Brotli compression (.css.br)
   * 15-25% smaller than gzip, 70% compression for CSS
   * @default true
   */
  brotli?: boolean

  /**
   * Brotli quality (0-11, higher = better compression but slower)
   * Use 11 for production (static compression, no runtime cost)
   * @default 11
   */
  brotliQuality?: number

  /**
   * Enable gzip compression (.css.gz)
   * Fallback for older servers
   * @default true
   */
  gzip?: boolean

  /**
   * Gzip level (0-9)
   * @default 9
   */
  gzipLevel?: number
}

export interface SilkPluginOptions {
  /**
   * Output CSS file path (relative to outDir)
   * @default 'silk.css'
   */
  outputFile?: string

  /**
   * Include CSS in HTML automatically
   * @default true
   */
  inject?: boolean

  /**
   * Minify CSS output
   * @default true in production
   */
  minify?: boolean

  /**
   * Watch mode for development
   * @default true
   */
  watch?: boolean

  /**
   * Pre-compression options (Brotli + gzip)
   * Generates .br and .gz files for web servers
   * @default { brotli: true, gzip: true }
   */
  compression?: CompressionOptions

  /**
   * Babel plugin options
   * Passed to @sylphx/babel-plugin-silk
   */
  babelOptions?: {
    production?: boolean
    classPrefix?: string
    importSources?: string[]
    tokens?: Record<string, any>
    breakpoints?: Record<string, string>
  }
}

export function silk(options: SilkPluginOptions = {}): Plugin {
  const {
    outputFile = 'silk.css',
    inject = true,
    minify,
    watch = true,
    compression = {},
    babelOptions = {},
  } = options

  const compressionConfig: Required<CompressionOptions> = {
    brotli: compression.brotli ?? true,
    brotliQuality: compression.brotliQuality ?? 11,
    gzip: compression.gzip ?? true,
    gzipLevel: compression.gzipLevel ?? 9,
  }

  let server: ViteDevServer | undefined
  let isBuild = false

  // Global CSS registry (className -> rule)
  const cssRules = new Map<string, string>()

  // Track which files have been transformed
  const transformedFiles = new Set<string>()

  /**
   * Generate compressed versions of CSS
   */
  async function generateCompressedAssets(css: string, fileName: string) {
    const outputs: Array<{ fileName: string; source: Buffer }> = []

    // Generate Brotli (.br) - Using Node.js built-in zlib brotli
    if (compressionConfig.brotli) {
      try {
        // Use Node.js built-in brotli compression
        const { brotliCompressSync, constants } = await import('node:zlib')
        const compressed = brotliCompressSync(Buffer.from(css, 'utf-8'), {
          params: {
            [constants.BROTLI_PARAM_QUALITY]: compressionConfig.brotliQuality,
          },
        })
        outputs.push({
          fileName: `${fileName}.br`,
          source: compressed,
        })
      } catch (error) {
        console.warn('Brotli compression failed:', error)
      }
    }

    // Generate gzip (.gz)
    if (compressionConfig.gzip) {
      try {
        const compressed = gzipSync(css, { level: compressionConfig.gzipLevel })
        outputs.push({
          fileName: `${fileName}.gz`,
          source: compressed,
        })
      } catch (error) {
        console.warn('Gzip compression failed:', error)
      }
    }

    return outputs
  }

  /**
   * Minify CSS (basic implementation)
   */
  function minifyCSS(css: string): string {
    return css
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}:;,])\s*/g, '$1')
      .replace(/;}/g, '}')
      .trim()
  }

  /**
   * Generate final CSS output
   */
  function generateCSS(): string {
    let css = Array.from(cssRules.values()).join('\n')

    if (minify ?? isBuild) {
      css = minifyCSS(css)
    }

    return css
  }

  return {
    name: 'silk',

    configResolved(config) {
      isBuild = config.command === 'build'

      // Set production flag for Babel plugin
      if (isBuild && babelOptions.production === undefined) {
        babelOptions.production = true
      }
    },

    configureServer(_server) {
      server = _server

      // Hot reload CSS in dev mode
      if (watch) {
        const watcher = setInterval(() => {
          const css = generateCSS()
          if (css && server) {
            server.ws.send({
              type: 'custom',
              event: 'silk:update',
              data: { css },
            })
          }
        }, 100)

        server.httpServer?.on('close', () => {
          clearInterval(watcher)
        })
      }
    },

    /**
     * Transform TypeScript/TSX files with Babel plugin
     */
    async transform(code, id) {
      // Only transform TypeScript files
      if (!id.endsWith('.ts') && !id.endsWith('.tsx')) {
        return null
      }

      // Skip node_modules
      if (id.includes('node_modules')) {
        return null
      }

      // Check if file imports @sylphx/silk
      if (!code.includes('@sylphx/silk')) {
        return null
      }

      try {
        // Dynamic import to avoid bundling in client build
        const { transformSync } = await import('@babel/core')
        const babelPluginSilk = (await import('@sylphx/babel-plugin-silk')).default

        // Transform with Babel plugin
        const result = transformSync(code, {
          filename: id,
          plugins: [[babelPluginSilk, babelOptions]],
          sourceMaps: true,
          configFile: false,
          babelrc: false,
        })

        if (!result || !result.code) {
          return null
        }

        // Extract CSS from metadata
        const metadata = result.metadata as { silk?: SilkMetadata } | undefined
        if (metadata?.silk && metadata.silk.cssRules) {
          for (const [className, rule] of metadata.silk.cssRules) {
            cssRules.set(className, rule)
          }

          // Log in dev mode
          if (!isBuild && metadata.silk.cssRules.length > 0) {
            console.log(
              `[Silk] Compiled ${metadata.silk.cssRules.length} CSS rules from ${path.basename(id)}`
            )
          }
        }

        return {
          code: result.code,
          map: result.map || undefined,
        }
      } catch (error) {
        // Log error but don't fail the build
        console.error(`[Silk] Transform error in ${id}:`, error)
        return null
      }
    },

    transformIndexHtml: {
      order: 'post',
      handler(html) {
        if (!inject) return html

        const css = generateCSS()
        if (!css) return html

        // Inject CSS into head
        const styleTag = `<style data-silk>${css}</style>`

        if (html.includes('</head>')) {
          return html.replace('</head>', `${styleTag}\n</head>`)
        }

        return `${styleTag}\n${html}`
      },
    },

    async generateBundle(_, bundle) {
      if (!isBuild) return

      const css = generateCSS()
      if (!css) return

      // Emit main CSS file
      this.emitFile({
        type: 'asset',
        fileName: outputFile,
        source: css,
      })

      // Generate and emit compressed versions
      const compressedAssets = await generateCompressedAssets(css, outputFile)
      for (const asset of compressedAssets) {
        this.emitFile({
          type: 'asset',
          fileName: asset.fileName,
          source: asset.source,
        })
      }

      // Log compression results
      if (compressedAssets.length > 0) {
        const originalSize = Buffer.byteLength(css, 'utf-8')
        console.log('\n📦 Silk CSS Bundle:')
        console.log(`  Original: ${formatBytes(originalSize)} (${outputFile})`)
        console.log(`  Rules: ${cssRules.size} atomic classes`)

        for (const asset of compressedAssets) {
          const compressedSize = asset.source.length
          const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1)
          const ext = asset.fileName.split('.').pop()
          console.log(`  ${ext?.toUpperCase()}: ${formatBytes(compressedSize)} (-${savings}%)`)
        }
        console.log('')
      }

      // Update HTML to reference external CSS file
      for (const fileName in bundle) {
        const chunk = bundle[fileName]
        if (chunk && chunk.type === 'asset' && fileName.endsWith('.html')) {
          const asset = chunk as any // OutputAsset type
          const html = asset.source as string
          const linkTag = `<link rel="stylesheet" href="/${outputFile}">`

          // Replace inline style with link tag
          asset.source = html
            .replace(/<style data-silk>[\s\S]*?<\/style>/, linkTag)
            .replace('</head>', `${linkTag}\n</head>`)
        }
      }
    },

    // Handle hot updates in dev mode
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        // Trigger CSS update
        const css = generateCSS()
        server.ws.send({
          type: 'custom',
          event: 'silk:update',
          data: { css },
        })
      }
    },

    // Build stats
    closeBundle() {
      if (isBuild && cssRules.size > 0) {
        const css = generateCSS()
        console.log(`[Silk] Final bundle: ${cssRules.size} atomic classes, ${formatBytes(Buffer.byteLength(css, 'utf-8'))}`)
      }
    },
  }
}

export default silk

/**
 * Client-side script for hot CSS updates
 * Import this in your app entry point for HMR
 */
export const silkClient = `
if (import.meta.hot) {
  import.meta.hot.on('silk:update', ({ css }) => {
    let style = document.querySelector('style[data-silk]')
    if (!style) {
      style = document.createElement('style')
      style.setAttribute('data-silk', '')
      document.head.appendChild(style)
    }
    style.textContent = css
  })
}
`

/**
 * Format bytes to human-readable format
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}
