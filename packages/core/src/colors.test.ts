/**
 * Tests for Modern CSS Color Functions
 */

import { describe, it, expect } from 'vitest'
import {
  oklch,
  lch,
  lab,
  hwb,
  colorMix,
  lighten,
  darken,
  alpha,
  parseOKLCH,
  isModernColorFunction,
  generatePalette,
  createColorScale,
  hexToOKLCH,
  defaultColorConfig,
} from './colors'

describe('Modern CSS Color Functions', () => {
  describe('oklch()', () => {
    it('should generate oklch color without alpha', () => {
      const result = oklch(0.7, 0.2, 250)
      expect(result).toBe('oklch(0.7 0.2 250)')
    })

    it('should generate oklch color with alpha', () => {
      const result = oklch(0.7, 0.2, 250, 0.8)
      expect(result).toBe('oklch(0.7 0.2 250 / 0.8)')
    })

    it('should handle lightness 0-1 range', () => {
      expect(oklch(0, 0.2, 250)).toBe('oklch(0 0.2 250)')
      expect(oklch(1, 0.2, 250)).toBe('oklch(1 0.2 250)')
      expect(oklch(0.5, 0.2, 250)).toBe('oklch(0.5 0.2 250)')
    })

    it('should handle hue 0-360 range', () => {
      expect(oklch(0.7, 0.2, 0)).toBe('oklch(0.7 0.2 0)')
      expect(oklch(0.7, 0.2, 180)).toBe('oklch(0.7 0.2 180)')
      expect(oklch(0.7, 0.2, 360)).toBe('oklch(0.7 0.2 360)')
    })
  })

  describe('lch()', () => {
    it('should generate lch color without alpha', () => {
      const result = lch(70, 50, 250)
      expect(result).toBe('lch(70% 50 250)')
    })

    it('should generate lch color with alpha', () => {
      const result = lch(70, 50, 250, 0.8)
      expect(result).toBe('lch(70% 50 250 / 0.8)')
    })
  })

  describe('lab()', () => {
    it('should generate lab color without alpha', () => {
      const result = lab(70, 20, -30)
      expect(result).toBe('lab(70% 20 -30)')
    })

    it('should generate lab color with alpha', () => {
      const result = lab(70, 20, -30, 0.5)
      expect(result).toBe('lab(70% 20 -30 / 0.5)')
    })
  })

  describe('hwb()', () => {
    it('should generate hwb color without alpha', () => {
      const result = hwb(240, 10, 20)
      expect(result).toBe('hwb(240 10% 20%)')
    })

    it('should generate hwb color with alpha', () => {
      const result = hwb(240, 10, 20, 0.9)
      expect(result).toBe('hwb(240 10% 20% / 0.9)')
    })
  })

  describe('colorMix()', () => {
    it('should generate color-mix with default options', () => {
      const result = colorMix('blue', 'white', 50)
      expect(result).toBe('color-mix(in oklch, blue 50%, white)')
    })

    it('should generate color-mix with custom color space', () => {
      const result = colorMix('red', 'black', 80, { colorSpace: 'srgb' })
      expect(result).toBe('color-mix(in srgb, red 80%, black)')
    })

    it('should generate color-mix with hue interpolation', () => {
      const result = colorMix('blue', 'red', 50, {
        colorSpace: 'oklch',
        hueInterpolation: 'longer',
      })
      expect(result).toBe('color-mix(in oklch longer hue, blue 50%, red)')
    })

    it('should handle hex colors', () => {
      const result = colorMix('#3b82f6', '#10b981', 30)
      expect(result).toBe('color-mix(in oklch, #3b82f6 30%, #10b981)')
    })

    it('should support all color spaces', () => {
      expect(colorMix('a', 'b', 50, { colorSpace: 'lch' })).toContain('in lch')
      expect(colorMix('a', 'b', 50, { colorSpace: 'lab' })).toContain('in lab')
      expect(colorMix('a', 'b', 50, { colorSpace: 'srgb' })).toContain('in srgb')
    })
  })

  describe('lighten()', () => {
    it('should lighten color by percentage', () => {
      const result = lighten('blue', 20)
      expect(result).toBe('color-mix(in oklch, white 80%, blue)')
    })

    it('should handle 0% lightening', () => {
      const result = lighten('blue', 0)
      expect(result).toBe('color-mix(in oklch, white 100%, blue)')
    })

    it('should handle 100% lightening', () => {
      const result = lighten('blue', 100)
      expect(result).toBe('color-mix(in oklch, white 0%, blue)')
    })

    it('should respect color space option', () => {
      const result = lighten('blue', 30, { colorSpace: 'lch' })
      expect(result).toContain('in lch')
    })
  })

  describe('darken()', () => {
    it('should darken color by percentage', () => {
      const result = darken('blue', 20)
      expect(result).toBe('color-mix(in oklch, black 80%, blue)')
    })

    it('should handle different percentages', () => {
      expect(darken('red', 10)).toContain('black 90%')
      expect(darken('red', 50)).toContain('black 50%')
      expect(darken('red', 90)).toContain('black 10%')
    })

    it('should respect color space option', () => {
      const result = darken('#3b82f6', 30, { colorSpace: 'srgb' })
      expect(result).toContain('in srgb')
    })
  })

  describe('alpha()', () => {
    it('should add transparency to color', () => {
      const result = alpha('blue', 50)
      expect(result).toBe('color-mix(in oklch, transparent 50%, blue)')
    })

    it('should handle full opacity', () => {
      const result = alpha('blue', 100)
      expect(result).toBe('color-mix(in oklch, transparent 0%, blue)')
    })

    it('should handle full transparency', () => {
      const result = alpha('blue', 0)
      expect(result).toBe('color-mix(in oklch, transparent 100%, blue)')
    })

    it('should work with oklch colors', () => {
      const result = alpha('oklch(0.7 0.2 250)', 80)
      expect(result).toContain('oklch(0.7 0.2 250)')
    })
  })

  describe('parseOKLCH()', () => {
    it('should parse oklch color without alpha', () => {
      const result = parseOKLCH('oklch(0.7 0.2 250)')
      expect(result).toEqual({
        l: 0.7,
        c: 0.2,
        h: 250,
        alpha: undefined,
      })
    })

    it('should parse oklch color with alpha', () => {
      const result = parseOKLCH('oklch(0.7 0.2 250 / 0.8)')
      expect(result).toEqual({
        l: 0.7,
        c: 0.2,
        h: 250,
        alpha: 0.8,
      })
    })

    it('should return null for invalid format', () => {
      expect(parseOKLCH('rgb(255, 0, 0)')).toBeNull()
      expect(parseOKLCH('invalid')).toBeNull()
      expect(parseOKLCH('#3b82f6')).toBeNull()
    })

    it('should handle decimal values', () => {
      const result = parseOKLCH('oklch(0.654 0.123 180.5)')
      expect(result?.l).toBe(0.654)
      expect(result?.c).toBe(0.123)
      expect(result?.h).toBe(180.5)
    })
  })

  describe('isModernColorFunction()', () => {
    it('should identify oklch colors', () => {
      expect(isModernColorFunction('oklch(0.7 0.2 250)')).toBe(true)
    })

    it('should identify lch colors', () => {
      expect(isModernColorFunction('lch(70% 50 250)')).toBe(true)
    })

    it('should identify lab colors', () => {
      expect(isModernColorFunction('lab(70% 20 -30)')).toBe(true)
    })

    it('should identify hwb colors', () => {
      expect(isModernColorFunction('hwb(240 10% 20%)')).toBe(true)
    })

    it('should identify color-mix', () => {
      expect(isModernColorFunction('color-mix(in oklch, blue 50%, white)')).toBe(
        true
      )
    })

    it('should not identify legacy colors', () => {
      expect(isModernColorFunction('rgb(255, 0, 0)')).toBe(false)
      expect(isModernColorFunction('hsl(240, 100%, 50%)')).toBe(false)
      expect(isModernColorFunction('#3b82f6')).toBe(false)
      expect(isModernColorFunction('blue')).toBe(false)
    })
  })

  describe('generatePalette()', () => {
    it('should generate color palette with default options', () => {
      const palette = generatePalette({ hue: 250 })

      expect(Object.keys(palette)).toHaveLength(11)
      expect(palette[50]).toContain('oklch')
      expect(palette[500]).toContain('oklch')
      expect(palette[950]).toContain('oklch')
    })

    it('should generate palette with custom chroma', () => {
      const palette = generatePalette({ hue: 250, chroma: 0.3 })

      expect(palette[500]).toContain('0.3')
    })

    it('should generate palette with custom shades', () => {
      const palette = generatePalette({ hue: 250, shades: 11 })

      expect(Object.keys(palette)).toHaveLength(11)
    })

    it('should have darker shades at higher numbers', () => {
      const palette = generatePalette({ hue: 250 })

      // Extract lightness from oklch strings
      const l50 = Number.parseFloat(palette[50].match(/oklch\(([\d.]+)/)?.[1] ?? '0')
      const l950 = Number.parseFloat(palette[950].match(/oklch\(([\d.]+)/)?.[1] ?? '0')

      expect(l50).toBeGreaterThan(l950)
    })
  })

  describe('createColorScale()', () => {
    it('should create color scale with default steps', () => {
      const scale = createColorScale('oklch(0.7 0.2 250)')

      expect(scale).toHaveLength(9)
      expect(scale[4]).toBe('oklch(0.7 0.2 250)') // Midpoint is base color
    })

    it('should create color scale with custom steps', () => {
      const scale = createColorScale('blue', { steps: 5 })

      expect(scale).toHaveLength(5)
      expect(scale[2]).toBe('blue') // Midpoint
    })

    it('should create lighter shades before base', () => {
      const scale = createColorScale('blue')

      expect(scale[0]).toContain('white')
      expect(scale[1]).toContain('white')
    })

    it('should create darker shades after base', () => {
      const scale = createColorScale('blue')

      expect(scale[5]).toContain('black')
      expect(scale[8]).toContain('black')
    })

    it('should respect color space option', () => {
      const scale = createColorScale('blue', { colorSpace: 'lch' })

      expect(scale[0]).toContain('in lch')
    })
  })

  describe('hexToOKLCH()', () => {
    it('should convert hex to oklch', () => {
      const result = hexToOKLCH('#ffffff')

      expect(result.l).toBeGreaterThan(0.9) // White is very light
      expect(result.c).toBeLessThan(0.1) // White has low chroma
    })

    it('should handle hex without #', () => {
      const result = hexToOKLCH('000000')

      expect(result.l).toBeLessThan(0.1) // Black is very dark
    })

    it('should convert blue hex', () => {
      const result = hexToOKLCH('#0000ff')

      expect(result.l).toBeGreaterThan(0)
      expect(result.l).toBeLessThan(1)
      expect(result.c).toBeGreaterThan(0)
      expect(result.h).toBeGreaterThan(0)
    })

    it('should return values in correct ranges', () => {
      const result = hexToOKLCH('#3b82f6')

      expect(result.l).toBeGreaterThanOrEqual(0)
      expect(result.l).toBeLessThanOrEqual(1)
      expect(result.c).toBeGreaterThanOrEqual(0)
      expect(result.h).toBeGreaterThanOrEqual(0)
      expect(result.h).toBeLessThanOrEqual(360)
    })
  })

  describe('Config', () => {
    it('should have correct default config', () => {
      expect(defaultColorConfig.enableModernColors).toBe(true)
      expect(defaultColorConfig.legacyFallback).toBe(false)
      expect(defaultColorConfig.defaultColorSpace).toBe('oklch')
    })
  })

  describe('Integration', () => {
    it('should create a complete color system', () => {
      const baseColor = 'oklch(0.7 0.2 250)'

      // Generate palette
      const palette = generatePalette({ hue: 250, chroma: 0.2 })

      // Create variations
      const light = lighten(baseColor, 20)
      const dark = darken(baseColor, 20)
      const transparent = alpha(baseColor, 50)

      // Mix colors
      const mixed = colorMix(baseColor, 'white', 50)

      expect(palette[500]).toContain('oklch')
      expect(light).toContain('color-mix')
      expect(dark).toContain('color-mix')
      expect(transparent).toContain('transparent')
      expect(mixed).toContain('color-mix')
    })

    it('should support dark mode color generation', () => {
      const lightColor = 'oklch(0.7 0.2 250)'
      const darkColor = darken(lightColor, 60)

      expect(darkColor).toContain('black 40%')
    })

    it('should support theme color mixing', () => {
      const primary = 'oklch(0.7 0.2 250)'
      const secondary = 'oklch(0.6 0.15 30)'
      const accent = colorMix(primary, secondary, 60)

      expect(accent).toContain('color-mix')
      expect(accent).toContain('60%')
    })
  })
})
