import { createStyleSystem, defineConfig } from './packages/core/src/index'

const config = defineConfig({
  colors: {
    blue: { 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a' },
    red: { 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d' },
    green: { 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d' },
    gray: { 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827' },
    purple: { 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce', 800: '#6b21a8', 900: '#581c87' },
    white: '#ffffff',
  },
  spacing: { 1: '0.25rem', 2: '0.5rem', 3: '0.75rem', 4: '1rem', 6: '1.5rem', 8: '2rem' },
  fontSizes: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem' },
  radii: { sm: '0.125rem', md: '0.375rem', lg: '0.5rem', xl: '0.75rem' },
  shadows: { sm: '0 1px 2px rgba(0,0,0,0.05)', md: '0 4px 6px rgba(0,0,0,0.1)', lg: '0 10px 15px rgba(0,0,0,0.1)' }
} as const)

const { css, getCSSRules } = createStyleSystem(config, {
  production: true,
  shortClassNames: true,
  minify: true,
  optimizeCSS: true
})

const colors = ['blue', 'red', 'green', 'gray', 'purple']
const shades = ['100', '200', '300', '400', '500', '600', '700', '800', '900']
const sizes = ['xs', 'sm', 'base', 'lg', 'xl']
const paddings = [2, 4, 6, 8]
const margins = [1, 2, 3, 4]
const rounds = ['sm', 'md', 'lg', 'xl']
const shadows = ['sm', 'md', 'lg']

for (let i = 0; i < 200; i++) {
  const colorKey = colors[i % 5] + '.' + shades[i % 9]
  const hoverKey = colors[i % 3] + '.' + shades[(i+3) % 9]
  css({
    bg: colorKey as any,
    color: 'white',
    p: paddings[i % 4],
    m: margins[i % 4],
    fontSize: sizes[i % 5] as any,
    rounded: rounds[i % 4] as any,
    shadow: shadows[i % 3] as any,
    _hover: { bg: hoverKey as any }
  })
}

const allCSS = getCSSRules({ optimize: true })
console.log('Silk CSS Size:', allCSS.length, 'bytes')
import { writeFileSync } from 'fs'
writeFileSync('/tmp/silk-output.css', allCSS)
