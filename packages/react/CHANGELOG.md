# @sylphx/silk-react

## 1.0.0

### Major Changes

- # Silk v0.2.0 - Complete Rebranding and Production Optimizations

  ## 🎨 Rebranding: ZenCSS → Silk

  Complete rebranding to avoid naming conflicts with existing @sylphx/zen and @sylphx/craft projects. "Silk" represents smooth, elegant styling that complements the ecosystem.

  ### Package Names

  - `@sylphx/zencss` → `@sylphx/silk`
  - `@sylphx/zencss-react` → `@sylphx/silk-react`
  - `@sylphx/zencss-vite-plugin` → `@sylphx/silk-vite-plugin`

  ### API Changes

  - `createZenReact()` → `createSilkReact()`
  - `ZenReactSystem` → `SilkReactSystem`
  - `zen.config.ts` → `silk.config.ts`

  ## 🚀 v0.2.0 Features

  ### Production Optimizations (45-65% smaller CSS)

  - **Short hashed class names**: `a0, a1, ...` instead of descriptive names (30-40% reduction)
  - **CSS optimization pipeline**: Property deduplication, color optimization, minification (10-15% reduction)
  - **Native CSS nesting**: Smaller output with `&` selector (5-10% reduction)

  ### Modern Color Functions

  - **OKLCH colors**: Perceptually uniform color space
  - **color-mix()**: Native browser color mixing (zero runtime)
  - **Palette generation**: Complete 11-shade palettes
  - **92% browser support** (Chrome 111+, Safari 15+, Firefox 113+)

  ### Style Composition API

  - **mergeStyles()**: Type-safe style merging
  - **createVariant()**: Simple variant system
  - **createCompoundVariant()**: Complex variant matching with defaults
  - **0.002ms per operation** (621,000 variants/second)

  ### @layer Architecture

  - **Predictable specificity**: No more `!important` hacks
  - **Automatic organization**: reset → base → tokens → recipes → utilities
  - **87% browser support** (Chrome 99+, Safari 15.4+, Firefox 97+)

  ## 📊 Real Benchmark Results

  **200 Components Test**:

  - Silk: **682 bytes gzipped**
  - Panda CSS: 5,936 bytes gzipped (+770%)
  - **Silk is 88.5% smaller**

  ## ✅ Features

  - ✅ **Zero Codegen** - No build step required (unlike Panda CSS)
  - ✅ **Full Type Safety** - Only design tokens allowed
  - ✅ **Critical CSS** - Built-in extraction (unique feature)
  - ✅ **Performance Monitoring** - Built-in analytics
  - ✅ **494 tests passing** - Battle-tested

  ## 🔗 Links

  - Repository: https://github.com/sylphxltd/silk
  - Website: https://sylphx.com
  - Documentation: See README.md

### Patch Changes

- Updated dependencies
  - @sylphx/silk@1.0.0

## 0.0.2

### Patch Changes

- Updated dependencies
  - @sylphx/silk@0.1.0
