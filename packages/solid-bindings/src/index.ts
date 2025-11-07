/**
 * @sylphx/silk-solid
 * Solid.js bindings for Silk with fine-grained reactivity
 */

import { createComponent, splitProps, mergeProps } from 'solid-js'
import type { Component, JSX } from 'solid-js'
import { createStyleSystem, type DesignConfig, type TypedStyleProps, type StyleSystem } from '@sylphx/silk'

export interface SilkSolidSystem<C extends DesignConfig> {
  /**
   * Create a styled Solid component
   */
  styled: <E extends keyof JSX.IntrinsicElements>(
    element: E,
    baseStyles?: TypedStyleProps<C>
  ) => Component<JSX.IntrinsicElements[E] & TypedStyleProps<C>>

  /**
   * CSS function for dynamic styles
   */
  css: StyleSystem<C>['css']

  /**
   * Box primitive component
   */
  Box: Component<JSX.IntrinsicElements['div'] & TypedStyleProps<C>>

  /**
   * Flex primitive component
   */
  Flex: Component<JSX.IntrinsicElements['div'] & TypedStyleProps<C>>

  /**
   * Get all CSS rules
   */
  getCSSRules: StyleSystem<C>['getCSSRules']
}

/**
 * Create Silk system for Solid.js
 *
 * @example
 * ```typescript
 * import { defineConfig } from '@sylphx/silk'
 * import { createSilkSolid } from '@sylphx/silk-solid'
 *
 * export const { styled, Box, css } = createSilkSolid(
 *   defineConfig({
 *     colors: { brand: { 500: '#3b82f6' } },
 *     spacing: { 4: '1rem' }
 *   })
 * )
 * ```
 */
export function createSilkSolid<const C extends DesignConfig>(
  config: C
): SilkSolidSystem<C> {
  const styleSystem = createStyleSystem<C>(config)

  /**
   * Create a styled Solid component
   */
  function styled<E extends keyof JSX.IntrinsicElements>(
    element: E,
    baseStyles?: TypedStyleProps<C>
  ): Component<JSX.IntrinsicElements[E] & TypedStyleProps<C>> {
    return (props) => {
      // Split style props from element props
      const [styleProps, elementProps] = splitProps(props, [
        // Color props
        'color', 'bg', 'backgroundColor', 'borderColor',
        // Spacing props
        'm', 'margin', 'mt', 'marginTop', 'mr', 'marginRight',
        'mb', 'marginBottom', 'ml', 'marginLeft',
        'p', 'padding', 'pt', 'paddingTop', 'pr', 'paddingRight',
        'pb', 'paddingBottom', 'pl', 'paddingLeft',
        'gap',
        // Size props
        'w', 'width', 'h', 'height',
        'minW', 'minWidth', 'minH', 'minHeight',
        'maxW', 'maxWidth', 'maxH', 'maxHeight',
        // Typography props
        'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'textAlign',
        // Layout props
        'display', 'flexDirection', 'justifyContent', 'alignItems',
        // Border props
        'rounded', 'borderRadius', 'borderWidth',
        // Effect props
        'opacity', 'shadow', 'boxShadow',
        // Pseudo states
        '_hover', '_focus', '_active', '_disabled',
        // Modern CSS
        'containerType', 'containerName', '@container', '@scope', '@starting-style',
        'viewTransitionName', 'contain'
      ] as const)

      // Merge base styles with props
      const mergedStyles = mergeProps(baseStyles || {}, styleProps)

      // Generate class name
      const className = styleSystem.css(mergedStyles as TypedStyleProps<C>)

      // Create component with class
      return createComponent(element as any, {
        ...elementProps,
        class: className,
      })
    }
  }

  // Create primitive components
  const Box = styled('div')
  const Flex = styled('div', { display: 'flex' })

  return {
    styled,
    css: styleSystem.css.bind(styleSystem),
    Box,
    Flex,
    getCSSRules: styleSystem.getCSSRules.bind(styleSystem),
  }
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
