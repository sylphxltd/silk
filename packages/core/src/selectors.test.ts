/**
 * Tests for CSS Selector optimization and :where()
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  wrapInWhere,
  generateSelector,
  calculateSpecificity,
  compareSpecificity,
  optimizeSelector,
  extractClassNames,
  hasPseudo,
  minifyClassName,
  ClassNameGenerator,
} from './selectors'

describe('CSS Selectors', () => {
  describe('wrapInWhere', () => {
    it('should wrap selector in :where()', () => {
      const wrapped = wrapInWhere('.test')
      expect(wrapped).toBe(':where(.test)')
    })

    it('should not wrap if already wrapped', () => {
      const wrapped = wrapInWhere(':where(.test)')
      expect(wrapped).toBe(':where(.test)')
    })

    it('should not wrap pseudo-selectors', () => {
      expect(wrapInWhere(':hover')).toBe(':hover')
      expect(wrapInWhere(':focus')).toBe(':focus')
      expect(wrapInWhere('::before')).toBe('::before')
    })

    it('should not wrap @-rules', () => {
      expect(wrapInWhere('@media')).toBe('@media')
      expect(wrapInWhere('@keyframes')).toBe('@keyframes')
      expect(wrapInWhere('@container')).toBe('@container')
    })

    it('should not wrap when disabled', () => {
      const wrapped = wrapInWhere('.test', false)
      expect(wrapped).toBe('.test')
    })

    it('should handle empty selector', () => {
      const wrapped = wrapInWhere('')
      expect(wrapped).toBe('')
    })
  })

  describe('generateSelector', () => {
    it('should generate selector with :where() by default', () => {
      const selector = generateSelector('test-class')
      expect(selector).toBe(':where(.test-class)')
    })

    it('should not wrap :where() on pseudo selectors', () => {
      const selector = generateSelector('test-class', {}, ':hover')
      expect(selector).toBe('.test-class:hover')
    })

    it('should generate plain selector when useWhere is false', () => {
      const selector = generateSelector('test-class', { useWhere: false })
      expect(selector).toBe('.test-class')
    })

    it('should handle pseudo selectors', () => {
      const selector = generateSelector('btn', {}, ':hover')
      expect(selector).toBe('.btn:hover')
    })
  })

  describe('calculateSpecificity', () => {
    it('should calculate specificity for simple class', () => {
      const spec = calculateSpecificity('.test')
      expect(spec).toEqual([0, 0, 1, 0])
    })

    it('should return zero specificity for :where()', () => {
      const spec = calculateSpecificity(':where(.test)')
      expect(spec).toEqual([0, 0, 0, 0])
    })

    it('should calculate specificity for ID selector', () => {
      const spec = calculateSpecificity('#test')
      expect(spec).toEqual([0, 1, 0, 0])
    })

    it('should calculate specificity for element selector', () => {
      const spec = calculateSpecificity('div')
      expect(spec).toEqual([0, 0, 0, 1])
    })

    it('should calculate specificity for attribute selector', () => {
      const spec = calculateSpecificity('[href]')
      expect(spec).toEqual([0, 0, 1, 0])
    })

    it('should calculate specificity for pseudo-class', () => {
      const spec = calculateSpecificity('.test:hover')
      // .test = 1 class, :hover matches :(?!where|is|not|has) so 1 more class
      expect(spec).toEqual([0, 0, 2, 1])
    })

    it('should calculate complex selector specificity', () => {
      const spec = calculateSpecificity('#id.class[href]:hover')
      // #id = 1 id, .class = 1 class, [href] = 1 class, :hover = 1 class
      expect(spec).toEqual([0, 1, 3, 1])
    })
  })

  describe('compareSpecificity', () => {
    it('should return 0 for equal specificity', () => {
      const result = compareSpecificity('.a', '.b')
      expect(result).toBe(0)
    })

    it('should return 1 when first is more specific', () => {
      const result = compareSpecificity('#test', '.test')
      expect(result).toBe(1)
    })

    it('should return -1 when second is more specific', () => {
      const result = compareSpecificity('.test', '#test')
      expect(result).toBe(-1)
    })

    it('should recognize :where() as lowest specificity', () => {
      const result = compareSpecificity('.test', ':where(.test)')
      expect(result).toBe(1)
    })
  })

  describe('optimizeSelector', () => {
    it('should remove redundant spaces', () => {
      const optimized = optimizeSelector('.a   .b')
      expect(optimized).toBe(':where(.a .b)')
    })

    it('should remove redundant universal selector', () => {
      const optimized = optimizeSelector('*.class', { useWhere: false })
      expect(optimized).toBe('.class')
    })

    it('should simplify attribute selectors', () => {
      const optimized = optimizeSelector('[class~="test"]', { useWhere: false })
      expect(optimized).toBe('.test')
    })

    it('should apply :where() when enabled', () => {
      const optimized = optimizeSelector('.test', { useWhere: true })
      expect(optimized).toBe(':where(.test)')
    })

    it('should not double-wrap :where()', () => {
      const optimized = optimizeSelector(':where(.test)', { useWhere: true })
      expect(optimized).toBe(':where(.test)')
    })
  })

  describe('extractClassNames', () => {
    it('should extract class names from selector', () => {
      const classes = extractClassNames('.a .b .c')
      expect(classes).toEqual(['a', 'b', 'c'])
    })

    it('should extract from complex selector', () => {
      const classes = extractClassNames('#id .class1.class2 [attr]')
      expect(classes).toEqual(['class1', 'class2'])
    })

    it('should return empty array for no classes', () => {
      const classes = extractClassNames('#id [attr]')
      expect(classes).toEqual([])
    })

    it('should handle :where() wrapper', () => {
      const classes = extractClassNames(':where(.a.b)')
      expect(classes).toEqual(['a', 'b'])
    })
  })

  describe('hasPseudo', () => {
    it('should detect pseudo-class', () => {
      expect(hasPseudo('.test:hover')).toBe(true)
    })

    it('should detect pseudo-element', () => {
      expect(hasPseudo('.test::before')).toBe(true)
    })

    it('should return false for no pseudo', () => {
      expect(hasPseudo('.test')).toBe(false)
    })

    it('should detect multiple pseudos', () => {
      expect(hasPseudo('.test:hover:focus')).toBe(true)
    })
  })

  describe('minifyClassName', () => {
    it('should generate short class names', () => {
      expect(minifyClassName(0, 0)).toBe('z0')
      expect(minifyClassName(1, 1)).toBe('z1')
      expect(minifyClassName(35, 35)).toBe('zz')
      expect(minifyClassName(36, 36)).toBe('z10')
    })

    it('should generate unique names for different indices', () => {
      const names = new Set()
      for (let i = 0; i < 100; i++) {
        names.add(minifyClassName(i, i))
      }
      expect(names.size).toBe(100)
    })
  })

  describe('ClassNameGenerator', () => {
    let generator: ClassNameGenerator

    beforeEach(() => {
      generator = new ClassNameGenerator()
    })

    it('should generate consistent class names', () => {
      const name1 = generator.generate('test')
      const name2 = generator.generate('test')
      expect(name1).toBe(name2)
    })

    it('should generate different names for different keys', () => {
      const name1 = generator.generate('test1')
      const name2 = generator.generate('test2')
      expect(name1).not.toBe(name2)
    })

    it('should use custom prefix', () => {
      generator = new ClassNameGenerator({ prefix: 'custom' })
      const name = generator.generate('test')
      expect(name).toContain('custom')
    })

    it('should minify in production mode', () => {
      generator = new ClassNameGenerator({ minifyClassNames: true })
      const name = generator.generate('test')
      expect(name).toMatch(/^z[0-9a-z]+$/)
    })

    it('should reset counter and cache', () => {
      generator.generate('test1')
      generator.generate('test2')
      expect(generator.getAll().size).toBe(2)

      generator.reset()
      expect(generator.getAll().size).toBe(0)
    })

    it('should return all generated names', () => {
      generator.generate('a')
      generator.generate('b')
      generator.generate('c')

      const all = generator.getAll()
      expect(all.size).toBe(3)
      expect(all.has('a')).toBe(true)
      expect(all.has('b')).toBe(true)
      expect(all.has('c')).toBe(true)
    })
  })

  describe('Integration', () => {
    it('should demonstrate zero specificity benefits', () => {
      // Without :where() - specificity (0,1,0)
      const regularSpec = calculateSpecificity('.button')

      // With :where() - specificity (0,0,0)
      const whereSpec = calculateSpecificity(':where(.button)')

      expect(regularSpec).toEqual([0, 0, 1, 0])
      expect(whereSpec).toEqual([0, 0, 0, 0])

      // :where() selector is easier to override
      expect(compareSpecificity('.custom', ':where(.button)')).toBe(1)
    })

    it('should generate production-ready selectors', () => {
      const generator = new ClassNameGenerator({
        useWhere: true,
        minifyClassNames: true,
      })

      const className = generator.generate('padding-4')
      const selector = generateSelector(className, { useWhere: true })

      // Short class name
      expect(className.length).toBeLessThan(10)

      // Zero specificity
      expect(selector).toContain(':where(')
      expect(calculateSpecificity(selector)).toEqual([0, 0, 0, 0])
    })

    it('should handle complex selector optimization flow', () => {
      let selector = '*.test-class   [class~="another"]   :hover'

      // Optimize
      selector = optimizeSelector(selector, { useWhere: false })

      // Should clean up spaces and simplify
      expect(selector).not.toContain('  ')
      expect(selector).not.toContain('*.')

      // Apply :where()
      const final = wrapInWhere(selector)
      expect(final).toContain(':where(')
      expect(calculateSpecificity(final)).toEqual([0, 0, 0, 0])
    })
  })
})
