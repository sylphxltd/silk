/**
 * Tests for CSS Cascade Layers (@layer)
 */

import { describe, it, expect } from 'vitest'
import {
  classifyLayer,
  generateLayerDefinition,
  wrapInLayer,
  organizeByLayers,
  LayerManager,
  defaultLayerConfig,
} from './layers'

describe('Cascade Layers', () => {
  describe('classifyLayer', () => {
    it('should classify recipe styles as recipes layer', () => {
      const layer = classifyLayer('padding', 4, 'recipe')
      expect(layer).toBe('recipes')
    })

    it('should classify base styles as base layer', () => {
      const layer = classifyLayer('fontSize', '16px', 'base')
      expect(layer).toBe('base')
    })

    it('should classify CSS variables as tokens layer', () => {
      const layer = classifyLayer('--primary-color', '#0066cc', 'atomic')
      expect(layer).toBe('tokens')
    })

    it('should classify atomic styles as utilities layer', () => {
      const layer = classifyLayer('color', 'red', 'atomic')
      expect(layer).toBe('utilities')
    })
  })

  describe('generateLayerDefinition', () => {
    it('should generate layer definition with default order', () => {
      const definition = generateLayerDefinition()
      expect(definition).toBe('@layer reset, base, tokens, recipes, utilities;')
    })

    it('should generate layer definition with custom order', () => {
      const definition = generateLayerDefinition({
        order: ['base', 'utilities'],
      })
      expect(definition).toBe('@layer base, utilities;')
    })

    it('should return empty string when disabled', () => {
      const definition = generateLayerDefinition({ enabled: false })
      expect(definition).toBe('')
    })

    it('should return empty string with empty order', () => {
      const definition = generateLayerDefinition({ order: [] })
      expect(definition).toBe('')
    })
  })

  describe('wrapInLayer', () => {
    it('should wrap CSS in layer', () => {
      const css = '.test { color: red; }'
      const wrapped = wrapInLayer(css, 'utilities')
      expect(wrapped).toBe('@layer utilities {\n.test { color: red; }\n}')
    })

    it('should not wrap when disabled', () => {
      const css = '.test { color: red; }'
      const wrapped = wrapInLayer(css, 'utilities', false)
      expect(wrapped).toBe(css)
    })

    it('should return empty string for empty CSS', () => {
      const wrapped = wrapInLayer('', 'utilities')
      expect(wrapped).toBe('')
    })

    it('should handle whitespace-only CSS', () => {
      const wrapped = wrapInLayer('   ', 'utilities')
      expect(wrapped).toBe('   ')
    })
  })

  describe('organizeByLayers', () => {
    it('should organize rules by layer with definition', () => {
      const rules = new Map()
      rules.set('base', ['.reset { margin: 0; }'])
      rules.set('utilities', ['.text-red { color: red; }'])

      const css = organizeByLayers(rules)

      expect(css).toContain('@layer reset, base, tokens, recipes, utilities;')
      expect(css).toContain('@layer base {')
      expect(css).toContain('.reset { margin: 0; }')
      expect(css).toContain('@layer utilities {')
      expect(css).toContain('.text-red { color: red; }')
    })

    it('should maintain layer order', () => {
      const rules = new Map()
      rules.set('utilities', ['.util { }'])
      rules.set('base', ['.base { }'])
      rules.set('tokens', ['.token { }'])

      const css = organizeByLayers(rules, {
        order: ['base', 'tokens', 'utilities'],
      })

      const baseIndex = css.indexOf('@layer base')
      const tokensIndex = css.indexOf('@layer tokens')
      const utilitiesIndex = css.indexOf('@layer utilities')

      expect(baseIndex).toBeLessThan(tokensIndex)
      expect(tokensIndex).toBeLessThan(utilitiesIndex)
    })

    it('should skip empty layers', () => {
      const rules = new Map()
      rules.set('base', [])
      rules.set('utilities', ['.test { }'])

      const css = organizeByLayers(rules)

      expect(css).not.toContain('@layer base {')
      expect(css).toContain('@layer utilities {')
    })

    it('should return flat CSS when disabled', () => {
      const rules = new Map()
      rules.set('base', ['.base { }'])
      rules.set('utilities', ['.util { }'])

      const css = organizeByLayers(rules, { enabled: false })

      expect(css).not.toContain('@layer')
      expect(css).toContain('.base { }')
      expect(css).toContain('.util { }')
    })
  })

  describe('LayerManager', () => {
    it('should initialize with default configuration', () => {
      const manager = new LayerManager()
      expect(manager.size()).toBe(0)
    })

    it('should add rules to correct layer', () => {
      const manager = new LayerManager()

      manager.add('.test { color: red; }', 'utilities')
      manager.add('.base { margin: 0; }', 'base')

      expect(manager.getLayer('utilities')).toHaveLength(1)
      expect(manager.getLayer('base')).toHaveLength(1)
    })

    it('should use default layer when not specified', () => {
      const manager = new LayerManager()

      manager.add('.test { color: red; }')

      expect(manager.getLayer('utilities')).toHaveLength(1)
    })

    it('should handle batch additions', () => {
      const manager = new LayerManager()

      manager.addBatch(['.a { }', '.b { }', '.c { }'], 'utilities')

      expect(manager.getLayer('utilities')).toHaveLength(3)
    })

    it('should deduplicate rules in same layer', () => {
      const manager = new LayerManager()

      manager.add('.test { color: red; }', 'utilities')
      manager.add('.test { color: red; }', 'utilities')
      manager.add('.test { color: red; }', 'utilities')

      expect(manager.getLayer('utilities')).toHaveLength(1)
    })

    it('should generate complete CSS with layers', () => {
      const manager = new LayerManager()

      manager.add('.reset { margin: 0; }', 'base')
      manager.add('.text-red { color: red; }', 'utilities')

      const css = manager.generateCSS()

      expect(css).toContain('@layer')
      expect(css).toContain('@layer base {')
      expect(css).toContain('@layer utilities {')
    })

    it('should clear all rules', () => {
      const manager = new LayerManager()

      manager.add('.test1 { }', 'base')
      manager.add('.test2 { }', 'utilities')

      expect(manager.size()).toBe(2)

      manager.clear()

      expect(manager.size()).toBe(0)
    })

    it('should respect custom configuration', () => {
      const manager = new LayerManager({
        enabled: true,
        order: ['base', 'custom'],
        defaultLayer: 'custom',
      })

      manager.add('.test { }')

      expect(manager.getLayer('custom')).toHaveLength(1)
    })

    it('should generate CSS without layers when disabled', () => {
      const manager = new LayerManager({ enabled: false })

      manager.add('.test { }', 'utilities')

      const css = manager.generateCSS()

      expect(css).not.toContain('@layer')
      expect(css).toContain('.test { }')
    })

    it('should count total rules across all layers', () => {
      const manager = new LayerManager()

      manager.add('.a { }', 'base')
      manager.add('.b { }', 'base')
      manager.add('.c { }', 'utilities')
      manager.add('.d { }', 'utilities')
      manager.add('.e { }', 'utilities')

      expect(manager.size()).toBe(5)
    })
  })

  describe('Integration', () => {
    it('should handle complex multi-layer scenarios', () => {
      const manager = new LayerManager()

      // Add reset styles
      manager.add('* { box-sizing: border-box; }', 'reset')

      // Add base styles
      manager.add('body { margin: 0; font-family: system-ui; }', 'base')

      // Add tokens
      manager.add(':root { --primary: #0066cc; }', 'tokens')

      // Add recipes
      manager.add('.button { padding: 0.5rem 1rem; }', 'recipes')

      // Add utilities
      manager.add('.text-red { color: red; }', 'utilities')
      manager.add('.p-4 { padding: 1rem; }', 'utilities')

      const css = manager.generateCSS()

      // Check layer definition
      expect(css).toContain('@layer reset, base, tokens, recipes, utilities;')

      // Check all layers present
      expect(css).toContain('@layer reset {')
      expect(css).toContain('@layer base {')
      expect(css).toContain('@layer tokens {')
      expect(css).toContain('@layer recipes {')
      expect(css).toContain('@layer utilities {')

      // Check order (utilities should come after base)
      const resetPos = css.indexOf('@layer reset {')
      const basePos = css.indexOf('@layer base {')
      const tokensPos = css.indexOf('@layer tokens {')
      const recipesPos = css.indexOf('@layer recipes {')
      const utilitiesPos = css.indexOf('@layer utilities {')

      expect(resetPos).toBeLessThan(basePos)
      expect(basePos).toBeLessThan(tokensPos)
      expect(tokensPos).toBeLessThan(recipesPos)
      expect(recipesPos).toBeLessThan(utilitiesPos)
    })
  })
})
