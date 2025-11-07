/**
 * Native CSS Nesting support
 * Browser support: Chrome 112+, Safari 16.5+, Firefox 115+ (Dec 2023)
 *
 * Generates modern nested CSS instead of expanded selectors
 */

export interface NestingConfig {
  /**
   * Enable native CSS nesting output
   * @default true (production-ready since Dec 2023)
   */
  enabled?: boolean

  /**
   * Fallback to expanded selectors for older browsers
   * @default false
   */
  legacyFallback?: boolean
}

export const defaultNestingConfig: Required<NestingConfig> = {
  enabled: true,
  legacyFallback: false,
}

/**
 * Check if a selector is nestable
 * Pseudo-classes (:hover), pseudo-elements (::before), attribute selectors, etc.
 */
export function isNestableSelector(selector: string): boolean {
  return (
    selector.startsWith(':') ||
    selector.startsWith('::') ||
    selector.startsWith('[') ||
    selector.startsWith('&') ||
    selector.startsWith('>')
  )
}

/**
 * Generate nested CSS rule
 *
 * Before (expanded):
 * .btn { color: blue; }
 * .btn:hover { color: red; }
 *
 * After (nested):
 * .btn {
 *   color: blue;
 *   &:hover { color: red; }
 * }
 */
export function generateNestedCSS(
  baseSelector: string,
  baseProps: Record<string, string>,
  nestedRules: Record<string, Record<string, string>>,
  config: NestingConfig = {}
): string {
  const { enabled, legacyFallback } = { ...defaultNestingConfig, ...config }

  // If nesting disabled or legacy fallback needed, use expanded selectors
  if (!enabled || legacyFallback) {
    return generateExpandedCSS(baseSelector, baseProps, nestedRules)
  }

  const parts: string[] = []

  // Base properties
  const baseDeclarations = Object.entries(baseProps)
    .map(([prop, value]) => `${prop}: ${value}`)
    .join('; ')

  // Build nested structure
  if (Object.keys(nestedRules).length > 0) {
    parts.push(`${baseSelector} {`)

    if (baseDeclarations) {
      parts.push(`  ${baseDeclarations};`)
    }

    // Add nested rules
    for (const [nestedSelector, props] of Object.entries(nestedRules)) {
      const nestedDeclarations = Object.entries(props)
        .map(([prop, value]) => `${prop}: ${value}`)
        .join('; ')

      // Use & for nesting
      const finalSelector = nestedSelector.startsWith('&')
        ? nestedSelector
        : `& ${nestedSelector}`

      parts.push(`  ${finalSelector} { ${nestedDeclarations}; }`)
    }

    parts.push('}')
  } else {
    // No nesting, just base rule
    parts.push(`${baseSelector} { ${baseDeclarations}; }`)
  }

  return parts.join('\n')
}

/**
 * Generate expanded CSS (legacy fallback)
 */
function generateExpandedCSS(
  baseSelector: string,
  baseProps: Record<string, string>,
  nestedRules: Record<string, Record<string, string>>
): string {
  const parts: string[] = []

  // Base rule
  const baseDeclarations = Object.entries(baseProps)
    .map(([prop, value]) => `${prop}: ${value}`)
    .join('; ')

  if (baseDeclarations) {
    parts.push(`${baseSelector} { ${baseDeclarations}; }`)
  }

  // Expanded nested rules
  for (const [nestedSelector, props] of Object.entries(nestedRules)) {
    const fullSelector = nestedSelector.startsWith('&')
      ? `${baseSelector}${nestedSelector.slice(1)}`
      : `${baseSelector} ${nestedSelector}`

    const declarations = Object.entries(props)
      .map(([prop, value]) => `${prop}: ${value}`)
      .join('; ')

    parts.push(`${fullSelector} { ${declarations}; }`)
  }

  return parts.join('\n')
}

/**
 * Group CSS rules by base selector for nesting
 *
 * Input:
 * ['.btn { color: blue; }', '.btn:hover { color: red; }', '.card { padding: 1rem; }']
 *
 * Output:
 * {
 *   '.btn': {
 *     base: { color: 'blue' },
 *     nested: { '&:hover': { color: 'red' } }
 *   },
 *   '.card': {
 *     base: { padding: '1rem' },
 *     nested: {}
 *   }
 * }
 */
export function groupRulesBySelector(rules: string[]): Map<
  string,
  {
    base: Record<string, string>
    nested: Record<string, Record<string, string>>
  }
> {
  const grouped = new Map<
    string,
    {
      base: Record<string, string>
      nested: Record<string, Record<string, string>>
    }
  >()

  for (const rule of rules) {
    const parsed = parseRule(rule)
    if (!parsed) continue

    const { selector, declarations } = parsed

    // Extract base selector (e.g., '.btn' from '.btn:hover')
    const baseSelector = extractBaseSelector(selector)

    if (!grouped.has(baseSelector)) {
      grouped.set(baseSelector, { base: {}, nested: {} })
    }

    const group = grouped.get(baseSelector)!

    if (selector === baseSelector) {
      // Base rule
      Object.assign(group.base, declarations)
    } else {
      // Nested rule (pseudo-class, pseudo-element, etc.)
      const nestedSelector = selector.replace(baseSelector, '&')
      group.nested[nestedSelector] = declarations
    }
  }

  return grouped
}

/**
 * Parse CSS rule into selector and declarations
 */
function parseRule(rule: string): { selector: string; declarations: Record<string, string> } | null {
  const match = rule.match(/^([^{]+)\{([^}]+)\}/)
  if (!match || !match[1] || !match[2]) return null

  const selector = match[1].trim()
  const declarationsStr = match[2].trim()

  const declarations: Record<string, string> = {}
  for (const decl of declarationsStr.split(';')) {
    const [prop, value] = decl.split(':').map((s) => s.trim())
    if (prop && value) {
      declarations[prop] = value
    }
  }

  return { selector, declarations }
}

/**
 * Extract base selector from a selector with pseudo-classes
 * '.btn:hover' → '.btn'
 * '.card::before' → '.card'
 * '.item[disabled]' → '.item'
 */
function extractBaseSelector(selector: string): string {
  // Remove pseudo-classes, pseudo-elements, attribute selectors
  return selector.replace(/(:[a-z-]+|::[a-z-]+|\[[^\]]+\])/g, '').trim()
}

/**
 * Convert expanded CSS to nested CSS
 */
export function convertToNestedCSS(css: string, config: NestingConfig = {}): string {
  const rules = css.split('\n').filter((r) => r.trim())
  const grouped = groupRulesBySelector(rules)

  const output: string[] = []

  for (const [baseSelector, { base, nested }] of grouped) {
    const nestedCSS = generateNestedCSS(baseSelector, base, nested, config)
    output.push(nestedCSS)
  }

  return output.join('\n\n')
}

/**
 * Check if nesting is supported by current browser
 * (This would be used at runtime in a browser environment)
 */
export function isNestingSupported(): boolean {
  if (typeof CSS === 'undefined' || typeof CSS.supports === 'undefined') {
    // Not in browser environment, assume supported
    return true
  }

  return CSS.supports('selector(&:hover)')
}
