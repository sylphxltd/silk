/**
 * Modern CSS Color Functions
 * Browser support: 92%+ global coverage (Q2 2025)
 *
 * Supports:
 * - oklch(): Perceptually uniform colors
 * - color-mix(): Native color mixing
 * - lch(), lab(): Wide gamut colors
 * - hwb(): Hue, Whiteness, Blackness
 */

export interface ColorConfig {
  /**
   * Enable modern color function output
   * @default true
   */
  enableModernColors?: boolean

  /**
   * Fallback to hex/rgb for older browsers
   * @default false
   */
  legacyFallback?: boolean

  /**
   * Default color space for color-mix()
   * @default 'oklch'
   */
  defaultColorSpace?: 'oklch' | 'lch' | 'lab' | 'srgb'
}

export const defaultColorConfig: Required<ColorConfig> = {
  enableModernColors: true,
  legacyFallback: false,
  defaultColorSpace: 'oklch',
}

/**
 * OKLCH color representation
 * Lightness (0-1), Chroma (0-0.4), Hue (0-360)
 */
export interface OKLCHColor {
  l: number // Lightness: 0-1
  c: number // Chroma: 0-0.4+
  h: number // Hue: 0-360
  alpha?: number // Alpha: 0-1
}

/**
 * Generate oklch() CSS color function
 *
 * OKLCH is perceptually uniform - better than HSL/RGB for:
 * - Color interpolation
 * - Dark mode transitions
 * - Consistent lightness perception
 *
 * @example
 * oklch(0.7, 0.2, 250) // Blue
 * oklch(0.5, 0.15, 30, 0.8) // Orange with alpha
 */
export function oklch(l: number, c: number, h: number, alpha?: number): string {
  if (alpha !== undefined) {
    return `oklch(${l} ${c} ${h} / ${alpha})`
  }
  return `oklch(${l} ${c} ${h})`
}

/**
 * Generate lch() CSS color function
 * Similar to oklch but uses CIELAB color space
 */
export function lch(l: number, c: number, h: number, alpha?: number): string {
  if (alpha !== undefined) {
    return `lch(${l}% ${c} ${h} / ${alpha})`
  }
  return `lch(${l}% ${c} ${h})`
}

/**
 * Generate lab() CSS color function
 * CIELAB color space (lightness, a-axis, b-axis)
 */
export function lab(l: number, a: number, b: number, alpha?: number): string {
  if (alpha !== undefined) {
    return `lab(${l}% ${a} ${b} / ${alpha})`
  }
  return `lab(${l}% ${a} ${b})`
}

/**
 * Generate hwb() CSS color function
 * Hue, Whiteness, Blackness
 */
export function hwb(h: number, w: number, b: number, alpha?: number): string {
  if (alpha !== undefined) {
    return `hwb(${h} ${w}% ${b}% / ${alpha})`
  }
  return `hwb(${h} ${w}% ${b}%)`
}

/**
 * Color mixing options
 */
export interface ColorMixOptions {
  /** Color space: oklch, lch, lab, srgb */
  colorSpace?: 'oklch' | 'lch' | 'lab' | 'srgb'
  /** Hue interpolation method (for cylindrical color spaces) */
  hueInterpolation?: 'shorter' | 'longer' | 'increasing' | 'decreasing'
}

/**
 * Generate color-mix() CSS function
 *
 * Native color mixing in browser - no runtime calculation needed!
 *
 * @example
 * colorMix('blue', 'white', 50) // Mix 50% blue with 50% white
 * colorMix('red', 'black', 80, { colorSpace: 'oklch' }) // 80% red, 20% black in oklch
 * colorMix('#3b82f6', '#10b981', 30) // 30% blue, 70% green
 */
export function colorMix(
  color1: string,
  color2: string,
  percentage: number,
  options: ColorMixOptions = {}
): string {
  const { colorSpace = 'oklch', hueInterpolation } = options

  const hueMethod = hueInterpolation ? ` ${hueInterpolation} hue` : ''
  return `color-mix(in ${colorSpace}${hueMethod}, ${color1} ${percentage}%, ${color2})`
}

/**
 * Generate lighter shade using color-mix
 *
 * @example
 * lighten('blue', 20) // Mix 20% white into blue
 * lighten('oklch(0.5 0.2 250)', 30) // Lighten oklch color by 30%
 */
export function lighten(
  color: string,
  percentage: number,
  options?: ColorMixOptions
): string {
  return colorMix('white', color, 100 - percentage, options)
}

/**
 * Generate darker shade using color-mix
 *
 * @example
 * darken('blue', 20) // Mix 20% black into blue
 * darken('#3b82f6', 30) // Darken hex color by 30%
 */
export function darken(
  color: string,
  percentage: number,
  options?: ColorMixOptions
): string {
  return colorMix('black', color, 100 - percentage, options)
}

/**
 * Generate alpha transparency using color-mix
 *
 * @example
 * alpha('blue', 50) // 50% transparent blue
 * alpha('oklch(0.7 0.2 250)', 80) // 80% opaque oklch blue
 */
export function alpha(
  color: string,
  percentage: number,
  options?: ColorMixOptions
): string {
  return colorMix('transparent', color, 100 - percentage, options)
}

/**
 * Parse oklch color string
 * @example parseOKLCH('oklch(0.7 0.2 250)') // { l: 0.7, c: 0.2, h: 250 }
 */
export function parseOKLCH(color: string): OKLCHColor | null {
  const match = color.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/)
  if (!match) return null

  return {
    l: Number.parseFloat(match[1]),
    c: Number.parseFloat(match[2]),
    h: Number.parseFloat(match[3]),
    alpha: match[4] ? Number.parseFloat(match[4]) : undefined,
  }
}

/**
 * Check if a color string uses modern color functions
 */
export function isModernColorFunction(color: string): boolean {
  return /^(oklch|lch|lab|hwb|color-mix)\(/.test(color)
}

/**
 * Check if modern color functions are supported
 * (Runtime browser check)
 */
export function areModernColorsSupported(): boolean {
  if (typeof CSS === 'undefined' || typeof CSS.supports === 'undefined') {
    // Not in browser environment, assume supported
    return true
  }

  // Test oklch support
  return CSS.supports('color', 'oklch(0.5 0.2 250)')
}

/**
 * Color palette generator using oklch
 * Generates perceptually uniform shades
 */
export interface ColorPaletteOptions {
  /** Base hue (0-360) */
  hue: number
  /** Chroma/saturation (0-0.4+) */
  chroma?: number
  /** Number of shades */
  shades?: number
}

/**
 * Generate color palette with perceptually uniform lightness
 *
 * @example
 * generatePalette({ hue: 250, chroma: 0.2 })
 * // Returns: { 50: 'oklch(0.95 0.2 250)', ..., 950: 'oklch(0.15 0.2 250)' }
 */
export function generatePalette(options: ColorPaletteOptions): Record<number, string> {
  const { hue, chroma = 0.2, shades = 11 } = options

  const palette: Record<number, string> = {}

  // Generate Tailwind-style scale: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
  const scaleMap = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  const step = 0.8 / (shades - 1) // Lightness range: 0.1 to 0.9

  for (let i = 0; i < shades; i++) {
    const lightness = 0.9 - i * step
    const shade = scaleMap[i] || (i + 1) * 100
    palette[shade] = oklch(Math.round(lightness * 100) / 100, chroma, hue)
  }

  return palette
}

/**
 * Create color scale from base color
 * Useful for generating design system color scales
 *
 * @example
 * createColorScale('oklch(0.7 0.2 250)', { steps: 9 })
 * // Returns array of 9 shades from light to dark
 */
export function createColorScale(
  baseColor: string,
  options: { steps?: number; colorSpace?: ColorMixOptions['colorSpace'] } = {}
): string[] {
  const { steps = 9, colorSpace = 'oklch' } = options

  const scale: string[] = []
  const midpoint = Math.floor(steps / 2)

  for (let i = 0; i < steps; i++) {
    if (i < midpoint) {
      // Lighter shades
      const percentage = ((midpoint - i) / midpoint) * 100
      scale.push(lighten(baseColor, percentage, { colorSpace }))
    } else if (i === midpoint) {
      // Base color
      scale.push(baseColor)
    } else {
      // Darker shades
      const percentage = ((i - midpoint) / (steps - midpoint - 1)) * 100
      scale.push(darken(baseColor, percentage, { colorSpace }))
    }
  }

  return scale
}

/**
 * Convert hex to oklch (approximate)
 * Note: This is a simplified conversion. For accurate conversion,
 * use a full color conversion library or CSS.supports() at runtime.
 */
export function hexToOKLCH(hex: string): OKLCHColor {
  // Remove # if present
  hex = hex.replace('#', '')

  // Parse RGB
  const r = Number.parseInt(hex.substring(0, 2), 16) / 255
  const g = Number.parseInt(hex.substring(2, 4), 16) / 255
  const b = Number.parseInt(hex.substring(4, 6), 16) / 255

  // Simplified linear RGB to oklch conversion
  // For production, use proper color conversion library
  const l = 0.2126 * r + 0.7152 * g + 0.0722 * b

  // Approximate chroma and hue (this is very simplified!)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const c = (max - min) * 0.3

  let h = 0
  if (c !== 0) {
    if (max === r) {
      h = ((g - b) / (max - min)) * 60
    } else if (max === g) {
      h = ((b - r) / (max - min)) * 60 + 120
    } else {
      h = ((r - g) / (max - min)) * 60 + 240
    }
  }

  if (h < 0) h += 360

  return {
    l: Math.round(l * 100) / 100,
    c: Math.round(c * 100) / 100,
    h: Math.round(h),
  }
}
