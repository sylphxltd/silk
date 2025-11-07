/**
 * Tests for Native CSS Nesting
 */

import { describe, it, expect } from 'vitest'
import {
  isNestableSelector,
  generateNestedCSS,
  groupRulesBySelector,
  convertToNestedCSS,
  defaultNestingConfig,
} from './nesting'

describe('Native CSS Nesting', () => {
  describe('isNestableSelector', () => {
    it('should identify pseudo-classes as nestable', () => {
      expect(isNestableSelector(':hover')).toBe(true)
      expect(isNestableSelector(':focus')).toBe(true)
      expect(isNestableSelector(':active')).toBe(true)
    })

    it('should identify pseudo-elements as nestable', () => {
      expect(isNestableSelector('::before')).toBe(true)
      expect(isNestableSelector('::after')).toBe(true)
      expect(isNestableSelector('::placeholder')).toBe(true)
    })

    it('should identify attribute selectors as nestable', () => {
      expect(isNestableSelector('[disabled]')).toBe(true)
      expect(isNestableSelector('[data-active="true"]')).toBe(true)
    })

    it('should identify & selector as nestable', () => {
      expect(isNestableSelector('&.active')).toBe(true)
      expect(isNestableSelector('& > .child')).toBe(true)
    })

    it('should identify child selectors as nestable', () => {
      expect(isNestableSelector('> .child')).toBe(true)
    })

    it('should not identify class selectors as nestable', () => {
      expect(isNestableSelector('.button')).toBe(false)
      expect(isNestableSelector('#id')).toBe(false)
      expect(isNestableSelector('div')).toBe(false)
    })
  })

  describe('generateNestedCSS', () => {
    it('should generate nested CSS with pseudo-classes', () => {
      const baseSelector = '.btn'
      const baseProps = { color: 'blue' }
      const nestedRules = {
        '&:hover': { color: 'red' },
        '&:focus': { outline: '2px solid blue' },
      }

      const result = generateNestedCSS(baseSelector, baseProps, nestedRules)

      expect(result).toContain('.btn {')
      expect(result).toContain('color: blue;')
      expect(result).toContain('&:hover { color: red; }')
      expect(result).toContain('&:focus { outline: 2px solid blue; }')
    })

    it('should generate nested CSS with pseudo-elements', () => {
      const baseSelector = '.card'
      const baseProps = { padding: '1rem' }
      const nestedRules = {
        '&::before': { content: '""', display: 'block' },
      }

      const result = generateNestedCSS(baseSelector, baseProps, nestedRules)

      expect(result).toContain('.card {')
      expect(result).toContain('padding: 1rem;')
      expect(result).toContain('&::before')
    })

    it('should handle base CSS without nesting', () => {
      const baseSelector = '.simple'
      const baseProps = { color: 'red', padding: '10px' }
      const nestedRules = {}

      const result = generateNestedCSS(baseSelector, baseProps, nestedRules)

      expect(result).toBe('.simple { color: red; padding: 10px; }')
    })

    it('should add & prefix to selectors without it', () => {
      const baseSelector = '.parent'
      const baseProps = { display: 'block' }
      const nestedRules = {
        '.child': { color: 'red' },
      }

      const result = generateNestedCSS(baseSelector, baseProps, nestedRules)

      expect(result).toContain('& .child { color: red; }')
    })

    it('should preserve & prefix if already present', () => {
      const baseSelector = '.parent'
      const baseProps = { display: 'block' }
      const nestedRules = {
        '&.active': { background: 'blue' },
      }

      const result = generateNestedCSS(baseSelector, baseProps, nestedRules)

      expect(result).toContain('&.active { background: blue; }')
      expect(result).not.toContain('& &.active')
    })

    it('should generate expanded CSS when disabled', () => {
      const baseSelector = '.btn'
      const baseProps = { color: 'blue' }
      const nestedRules = {
        '&:hover': { color: 'red' },
      }

      const result = generateNestedCSS(baseSelector, baseProps, nestedRules, {
        enabled: false,
      })

      expect(result).toContain('.btn { color: blue; }')
      expect(result).toContain('.btn:hover { color: red; }')
      expect(result).not.toContain('&:hover')
    })

    it('should generate expanded CSS when legacy fallback enabled', () => {
      const baseSelector = '.btn'
      const baseProps = { color: 'blue' }
      const nestedRules = {
        '&:hover': { color: 'red' },
      }

      const result = generateNestedCSS(baseSelector, baseProps, nestedRules, {
        enabled: true,
        legacyFallback: true,
      })

      expect(result).toContain('.btn { color: blue; }')
      expect(result).toContain('.btn:hover { color: red; }')
      expect(result).not.toContain('&:hover')
    })

    it('should handle multiple properties in nested rules', () => {
      const baseSelector = '.card'
      const baseProps = { padding: '1rem' }
      const nestedRules = {
        '&:hover': {
          background: '#f0f0f0',
          transform: 'scale(1.05)',
          'box-shadow': '0 4px 8px rgba(0,0,0,0.1)',
        },
      }

      const result = generateNestedCSS(baseSelector, baseProps, nestedRules)

      expect(result).toContain('background: #f0f0f0')
      expect(result).toContain('transform: scale(1.05)')
      expect(result).toContain('box-shadow: 0 4px 8px rgba(0,0,0,0.1)')
    })
  })

  describe('groupRulesBySelector', () => {
    it('should group base and nested rules', () => {
      const rules = [
        '.btn { color: blue; }',
        '.btn:hover { color: red; }',
        '.btn:focus { outline: 2px solid blue; }',
      ]

      const grouped = groupRulesBySelector(rules)

      expect(grouped.has('.btn')).toBe(true)
      const btnGroup = grouped.get('.btn')!
      expect(btnGroup.base).toEqual({ color: 'blue' })
      expect(btnGroup.nested).toEqual({
        '&:hover': { color: 'red' },
        '&:focus': { outline: '2px solid blue' },
      })
    })

    it('should handle multiple base selectors', () => {
      const rules = [
        '.btn { color: blue; }',
        '.btn:hover { color: red; }',
        '.card { padding: 1rem; }',
        '.card:hover { background: #f0f0f0; }',
      ]

      const grouped = groupRulesBySelector(rules)

      expect(grouped.size).toBe(2)
      expect(grouped.has('.btn')).toBe(true)
      expect(grouped.has('.card')).toBe(true)
    })

    it('should handle rules without nesting', () => {
      const rules = ['.simple { color: red; }', '.another { padding: 10px; }']

      const grouped = groupRulesBySelector(rules)

      expect(grouped.size).toBe(2)
      expect(grouped.get('.simple')?.base).toEqual({ color: 'red' })
      expect(grouped.get('.simple')?.nested).toEqual({})
    })

    it('should handle pseudo-elements', () => {
      const rules = [
        '.card { position: relative; }',
        '.card::before { content: ""; display: block; }',
      ]

      const grouped = groupRulesBySelector(rules)

      const cardGroup = grouped.get('.card')!
      expect(cardGroup.base).toEqual({ position: 'relative' })
      expect(cardGroup.nested['&::before']).toEqual({
        content: '""',
        display: 'block',
      })
    })

    it('should merge multiple declarations for same selector', () => {
      const rules = [
        '.btn { color: blue; }',
        '.btn { padding: 10px; }',
        '.btn:hover { color: red; }',
      ]

      const grouped = groupRulesBySelector(rules)

      const btnGroup = grouped.get('.btn')!
      expect(btnGroup.base).toEqual({ color: 'blue', padding: '10px' })
    })
  })

  describe('convertToNestedCSS', () => {
    it('should convert expanded CSS to nested CSS', () => {
      const expandedCSS = `.btn { color: blue; }
.btn:hover { color: red; }
.btn:focus { outline: 2px solid blue; }`

      const result = convertToNestedCSS(expandedCSS)

      expect(result).toContain('.btn {')
      expect(result).toContain('color: blue;')
      expect(result).toContain('&:hover { color: red; }')
      expect(result).toContain('&:focus { outline: 2px solid blue; }')
    })

    it('should handle multiple independent selectors', () => {
      const expandedCSS = `.btn { color: blue; }
.btn:hover { color: red; }
.card { padding: 1rem; }
.card:hover { background: #f0f0f0; }`

      const result = convertToNestedCSS(expandedCSS)

      expect(result).toContain('.btn {')
      expect(result).toContain('&:hover { color: red; }')
      expect(result).toContain('.card {')
      expect(result).toContain('&:hover { background: #f0f0f0; }')
    })

    it('should handle CSS without nesting opportunities', () => {
      const expandedCSS = `.simple { color: red; }
.another { padding: 10px; }`

      const result = convertToNestedCSS(expandedCSS)

      expect(result).toContain('.simple { color: red; }')
      expect(result).toContain('.another { padding: 10px; }')
      expect(result).not.toContain('&')
    })

    it('should respect config options', () => {
      const expandedCSS = `.btn { color: blue; }
.btn:hover { color: red; }`

      const result = convertToNestedCSS(expandedCSS, { enabled: false })

      expect(result).toContain('.btn { color: blue; }')
      expect(result).toContain('.btn:hover { color: red; }')
      expect(result).not.toContain('&:hover')
    })
  })

  describe('Config', () => {
    it('should have correct default config', () => {
      expect(defaultNestingConfig.enabled).toBe(true)
      expect(defaultNestingConfig.legacyFallback).toBe(false)
    })
  })
})
