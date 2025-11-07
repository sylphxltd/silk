/**
 * @sylphx/silk-svelte
 * Svelte bindings for Silk with reactive stores and minimal re-renders
 */

import { createStyleSystem, type DesignConfig, type TypedStyleProps, type StyleSystem } from '@sylphx/silk'

export interface SilkSvelteSystem<C extends DesignConfig> {
  /**
   * CSS function for generating class names
   */
  css: StyleSystem<C>['css']

  /**
   * Create class name with reactive stores support
   */
  cx: (...args: Array<string | undefined | null | false>) => string

  /**
   * Get all CSS rules
   */
  getCSSRules: StyleSystem<C>['getCSSRules']
}

/**
 * Create Silk system for Svelte
 *
 * @example
 * ```typescript
 * import { defineConfig } from '@sylphx/silk'
 * import { createSilkSvelte } from '@sylphx/silk-svelte'
 *
 * export const { css, cx } = createSilkSvelte(
 *   defineConfig({
 *     colors: { brand: { 500: '#3b82f6' } },
 *     spacing: { 4: '1rem' }
 *   })
 * )
 * ```
 */
export function createSilkSvelte<const C extends DesignConfig>(
  config: C
): SilkSvelteSystem<C> {
  const styleSystem = createStyleSystem<C>(config)

  /**
   * Combine class names
   */
  function cx(...args: Array<string | undefined | null | false>): string {
    return args.filter(Boolean).join(' ')
  }

  return {
    css: styleSystem.css.bind(styleSystem),
    cx,
    getCSSRules: styleSystem.getCSSRules.bind(styleSystem),
  }
}

/**
 * Helper to create styled props for Svelte components
 *
 * @example
 * ```typescript
 * import { styleProps } from '@sylphx/silk-svelte'
 *
 * export let props = styleProps({ bg: 'brand.500', px: 4 })
 * ```
 */
export function styleProps<C extends DesignConfig>(
  styles: TypedStyleProps<C>
): TypedStyleProps<C> {
  return styles
}

/**
 * Merge multiple style objects
 * Useful for combining base styles with variants
 *
 * @example
 * ```typescript
 * import { mergeStyles } from '@sylphx/silk-svelte'
 *
 * const styles = mergeStyles(
 *   baseStyles,
 *   variantStyles,
 *   conditionalStyles && additionalStyles
 * )
 * ```
 */
export function mergeStyles<C extends DesignConfig>(
  ...styles: Array<TypedStyleProps<C> | undefined | false>
): TypedStyleProps<C> {
  return Object.assign({}, ...styles.filter(Boolean)) as TypedStyleProps<C>
}

// Re-export core types
export type {
  DesignConfig,
  TypedStyleProps,
  StyleObject,
  CSSProperties,
} from '@sylphx/silk'

// Re-export core utilities
export * from '@sylphx/silk'
