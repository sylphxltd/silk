/**
 * @sylphx/silk/optimizer
 * Build-time optimization utilities (Node.js only)
 *
 * This module contains build-time tools that should NOT be bundled in browser code:
 * - LightningCSS optimization
 * - CSS production optimization
 * - Atomic CSS registry
 * - Critical CSS extraction
 *
 * Import from: @sylphx/silk/optimizer
 */

// Production optimizations (with LightningCSS - 5-10x faster)
export {
  generateClassName,
  generateShortClassName,
  hashStyleId,
  optimizeCSS,
  optimizeCSSWithLightning,
  smartOptimizeCSS,
  resetShortNameCounter,
  getShortNameCount,
} from './production'
export type { ProductionConfig, CSSOptimizationResult } from './production'

// Atomic CSS Deduplication (10-20% smaller for large apps)
export {
  AtomicCSSRegistry,
  getAtomicRegistry,
  resetAtomicRegistry,
  generateAtomicReport,
} from './atomic'
export type { AtomicCSSOptions } from './atomic'

// Critical CSS Extraction (30-50% faster first paint)
export {
  CriticalCSSExtractor,
  CriticalCSSMeasurement,
} from './critical-css'
export type {
  CriticalCSSConfig,
} from './critical-css'
