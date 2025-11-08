/**
 * Universal CSS optimization using LightningCSS WASM
 * Works everywhere: Node.js, Bun, Deno, Turbopack, browsers
 * Uses WebAssembly (no native bindings - Turbopack compatible!)
 */

import type { ProductionConfig, CSSOptimizationResult } from './production.js'
import { optimizeCSS } from './production.js'

// Dynamic import to avoid bundling WASM in runtime
type LightningCSSWASM = typeof import('lightningcss-wasm')
let lightningcss: LightningCSSWASM | null = null
let wasmInitialized = false

// Lazy load lightningcss-wasm only when needed
async function loadLightningCSS(): Promise<LightningCSSWASM | null> {
  if (lightningcss) return lightningcss

  try {
    // Import WASM module
    lightningcss = await import('lightningcss-wasm')

    // Initialize WASM (required before first use)
    if (!wasmInitialized && lightningcss.default) {
      await lightningcss.default()
      wasmInitialized = true
    }

    return lightningcss
  } catch (error) {
    // LightningCSS WASM not available - fall back to pure JS optimization
    return null
  }
}

/**
 * Optimize CSS with LightningCSS WASM
 *
 * Benefits:
 * - 5-10x faster than pure JS optimization
 * - Works everywhere: Node.js, Bun, Deno, Turbopack, browsers
 * - No native bindings (Turbopack compatible!)
 * - Automatic vendor prefixing
 * - Better minification (5-10% smaller)
 *
 * Automatically falls back to pure JS if WASM unavailable
 */
export async function optimizeCSSWithLightning(
  css: string,
  config: ProductionConfig = {}
): Promise<CSSOptimizationResult> {
  const originalSize = new TextEncoder().encode(css).length

  try {
    const lightning = await loadLightningCSS()

    if (!lightning) {
      // LightningCSS not available - use fallback
      return optimizeCSS(css)
    }

    const { code } = lightning.transform({
      filename: 'silk.css',
      code: new TextEncoder().encode(css),
      minify: config.minify ?? true,
      ...(config.targets && { targets: config.targets }),
    })

    const optimized = new TextDecoder().decode(code)
    const optimizedSize = new TextEncoder().encode(optimized).length
    const percentage = ((originalSize - optimizedSize) / originalSize) * 100

    return {
      optimized,
      savings: {
        originalSize,
        optimizedSize,
        percentage,
      },
    }
  } catch (error) {
    // LightningCSS failed - fallback to manual optimization
    return optimizeCSS(css)
  }
}
