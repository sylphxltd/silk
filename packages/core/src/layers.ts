/**
 * CSS Cascade Layers (@layer) support
 * Provides explicit style priority control without specificity wars
 */

export type CascadeLayer = 'reset' | 'base' | 'tokens' | 'recipes' | 'utilities' | 'overrides'

export interface LayerConfig {
  /**
   * Enable cascade layers in CSS output
   * @default true
   */
  enabled?: boolean

  /**
   * Order of cascade layers (earlier = lower priority)
   * @default ['reset', 'base', 'tokens', 'recipes', 'utilities']
   */
  order?: CascadeLayer[]

  /**
   * Default layer for atomic classes
   * @default 'utilities'
   */
  defaultLayer?: CascadeLayer
}

/**
 * Default layer configuration
 */
export const defaultLayerConfig: Required<LayerConfig> = {
  enabled: true,
  order: ['reset', 'base', 'tokens', 'recipes', 'utilities'],
  defaultLayer: 'utilities',
}

/**
 * Classify a CSS property into appropriate layer
 */
export function classifyLayer(
  prop: string,
  value: any,
  context: 'atomic' | 'recipe' | 'base' = 'atomic'
): CascadeLayer {
  // Recipe styles go to recipes layer
  if (context === 'recipe') {
    return 'recipes'
  }

  // Base/reset styles
  if (context === 'base') {
    return 'base'
  }

  // Token definitions (CSS variables)
  if (prop.startsWith('--')) {
    return 'tokens'
  }

  // Everything else goes to utilities (atomic classes)
  return 'utilities'
}

/**
 * Generate @layer definition CSS
 */
export function generateLayerDefinition(config: LayerConfig = {}): string {
  const { enabled, order } = { ...defaultLayerConfig, ...config }

  if (!enabled || !order || order.length === 0) {
    return ''
  }

  return `@layer ${order.join(', ')};`
}

/**
 * Wrap CSS rules in appropriate layer
 */
export function wrapInLayer(css: string, layer: CascadeLayer, enabled = true): string {
  if (!enabled || !css.trim()) {
    return css
  }

  return `@layer ${layer} {\n${css}\n}`
}

/**
 * Organize CSS rules by layer
 */
export function organizeByLayers(
  rules: Map<CascadeLayer, string[]>,
  config: LayerConfig = {}
): string {
  const { enabled, order } = { ...defaultLayerConfig, ...config }

  if (!enabled) {
    // Return all rules without layers
    return Array.from(rules.values())
      .flat()
      .join('\n')
  }

  const parts: string[] = []

  // Add layer definition
  const layerDef = generateLayerDefinition(config)
  if (layerDef) {
    parts.push(layerDef)
    parts.push('')
  }

  // Add rules in layer order
  for (const layer of order || []) {
    const layerRules = rules.get(layer)
    if (layerRules && layerRules.length > 0) {
      const css = layerRules.join('\n')
      parts.push(wrapInLayer(css, layer, true))
      parts.push('')
    }
  }

  return parts.join('\n').trim()
}

/**
 * Extract layer from CSS rule comment
 * E.g., /* @layer utilities *\/
 */
export function extractLayerFromComment(css: string): CascadeLayer | null {
  const match = css.match(/\/\*\s*@layer\s+(\w+)\s*\*\//)
  if (match && match[1]) {
    return match[1] as CascadeLayer
  }
  return null
}

/**
 * Group rules by layer
 */
export class LayerManager {
  private rules: Map<CascadeLayer, Set<string>>
  private config: Required<LayerConfig>

  constructor(config: LayerConfig = {}) {
    this.config = { ...defaultLayerConfig, ...config }
    this.rules = new Map()

    // Initialize all layers
    for (const layer of this.config.order) {
      this.rules.set(layer, new Set())
    }
  }

  /**
   * Add a CSS rule to a specific layer
   */
  add(css: string, layer: CascadeLayer = this.config.defaultLayer): void {
    if (!this.rules.has(layer)) {
      this.rules.set(layer, new Set())
    }
    this.rules.get(layer)!.add(css)
  }

  /**
   * Add multiple rules to a layer
   */
  addBatch(rules: string[], layer: CascadeLayer = this.config.defaultLayer): void {
    for (const rule of rules) {
      this.add(rule, layer)
    }
  }

  /**
   * Get all rules for a specific layer
   */
  getLayer(layer: CascadeLayer): string[] {
    return Array.from(this.rules.get(layer) || [])
  }

  /**
   * Generate complete CSS with layers
   */
  generateCSS(): string {
    const rulesMap = new Map<CascadeLayer, string[]>()

    for (const [layer, rules] of this.rules.entries()) {
      rulesMap.set(layer, Array.from(rules))
    }

    return organizeByLayers(rulesMap, this.config)
  }

  /**
   * Clear all rules
   */
  clear(): void {
    for (const rules of this.rules.values()) {
      rules.clear()
    }
  }

  /**
   * Get total number of rules across all layers
   */
  size(): number {
    let total = 0
    for (const rules of this.rules.values()) {
      total += rules.size
    }
    return total
  }
}
