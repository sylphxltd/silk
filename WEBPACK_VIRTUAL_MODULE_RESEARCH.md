# Webpack Virtual Module Research

## Research Question

Can Webpack support virtual CSS modules to enable no-codegen CSS generation that flows through the official build pipeline?

## Answer: ✅ YES

Using `webpack-virtual-modules` package, we can create virtual CSS files that Webpack treats as real files.

---

## Solution: webpack-virtual-modules

**Package:** https://www.npmjs.com/package/webpack-virtual-modules
**GitHub:** https://github.com/sysgears/webpack-virtual-modules
**Maintained:** ✅ Active (updated 2024)

### Key Features

- ✅ Create in-memory virtual modules
- ✅ Webpack treats them as real filesystem files
- ✅ Supports watch mode (write triggers recompilation)
- ✅ Works with all loaders (css-loader, MiniCssExtractPlugin, etc.)
- ✅ Can create virtual modules in node_modules

### How It Works

```javascript
const VirtualModulesPlugin = require('webpack-virtual-modules');

// Create virtual CSS file
const virtualModules = new VirtualModulesPlugin({
  'node_modules/silk.css': generatedCSSContent
});

module.exports = {
  plugins: [virtualModules],
  module: {
    rules: [{
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader']
    }]
  }
}
```

User imports normally:
```typescript
import 'silk.css'  // Resolves to virtual node_modules/silk.css
```

### CSS Pipeline Flow

```
User: import 'silk.css'
  ↓
Webpack resolves to virtual node_modules/silk.css
  ↓
css-loader processes CSS
  ↓
MiniCssExtractPlugin extracts to separate file
  ↓
Optimization/minification
  ↓
Output to dist/[hash].css
  ↓
HTML injection
```

✅ Complete framework CSS pipeline integration

---

## Implementation for Silk

### Webpack Plugin Architecture

```javascript
// packages/webpack-plugin/src/index.ts
import VirtualModulesPlugin from 'webpack-virtual-modules';
import { scanAndGenerate } from '@sylphx/silk-core';

class SilkWebpackPlugin {
  apply(compiler) {
    // 1. Generate CSS on plugin initialization
    const css = scanAndGenerate('./src');

    // 2. Create virtual module
    const virtualModules = new VirtualModulesPlugin({
      'node_modules/silk.css': css
    });
    virtualModules.apply(compiler);

    // 3. Watch mode: regenerate on file changes
    compiler.hooks.watchRun.tapAsync('SilkWebpackPlugin', async (compiler, callback) => {
      const css = await scanAndGenerate('./src');
      virtualModules.writeModule('node_modules/silk.css', css);
      callback();
    });
  }
}

export default SilkWebpackPlugin;
```

### User Setup

```javascript
// webpack.config.js
const SilkWebpackPlugin = require('@sylphx/webpack-plugin-silk');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [
    new SilkWebpackPlugin(),
    new MiniCssExtractPlugin()
  ],
  module: {
    rules: [{
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader']
    }]
  }
}
```

```typescript
// src/index.ts
import 'silk.css'  // Virtual module → webpack CSS pipeline
```

---

## Next.js Compatibility

### Question: Does Next.js support webpack-virtual-modules?

**Answer: ✅ YES**

Next.js uses webpack internally, so we can inject webpack plugins via `next.config.js`:

```javascript
// next.config.js
const SilkWebpackPlugin = require('@sylphx/webpack-plugin-silk');

module.exports = {
  webpack(config, options) {
    config.plugins.push(new SilkWebpackPlugin());
    return config;
  }
}
```

```typescript
// app/layout.tsx
import 'silk.css'  // Virtual module → Next.js CSS pipeline
```

### Next.js CSS Pipeline Flow

```
import 'silk.css'
  ↓
Virtual module (webpack-virtual-modules)
  ↓
Next.js webpack config (css-loader)
  ↓
PostCSS (from next.config.js)
  ↓
Optimization
  ↓
Output to .next/static/css/[hash].css
  ↓
HTML injection (automatic)
```

✅ Complete Next.js integration

---

## Turbopack Compatibility

### Question: Does Turbopack support webpack-virtual-modules?

**Answer: ❌ NO**

Turbopack is a different bundler (not webpack), so webpack plugins don't work.

### Solution: Semi-codegen for Turbopack

For Turbopack-only builds:
```bash
silk generate → src/silk.generated.css
```

```typescript
import '../src/silk.generated.css'
```

### Hybrid Approach for Next.js

Next.js 16 supports both webpack and Turbopack:

```json
{
  "scripts": {
    "dev": "next dev --turbo",           // Turbopack (semi-codegen)
    "build": "next build"                 // Webpack (virtual module)
  }
}
```

**Dev (Turbopack):**
- Use `silk generate --watch`
- Import `../src/silk.generated.css`

**Production (Webpack):**
- Use webpack plugin with virtual module
- Import `silk.css`

**OR: Just use webpack for both:**
```json
{
  "scripts": {
    "dev": "next dev",                   // Webpack
    "build": "next build"                // Webpack
  }
}
```

---

## Performance Considerations

### Virtual Module Creation

**When is CSS generated?**
- Plugin initialization (before compilation)
- Watch mode: on file changes

**Cost:**
- Scan src/**/*.{ts,tsx,js,jsx}
- Parse AST for css() calls
- Generate CSS
- Optimize with lightningcss-wasm

**Estimate:** ~100-500ms for medium codebase

**Acceptable because:**
- Only happens once per build
- Only on watch trigger (file changes)
- Similar cost to other build plugins

### Watch Mode Optimization

**Option 1: Scan all files on every change**
- Simple but slow for large codebases

**Option 2: Cache and incremental updates**
- Track which files changed
- Only re-parse changed files
- Merge with cached CSS

**Recommendation:** Start with Option 1, optimize later if needed

---

## Comparison with Other Tools

### Astroturf (CSS-in-JS tool)

Uses `webpack-virtual-modules` for CSS extraction:
- Extracts CSS from template tags
- Creates virtual CSS files
- Proven production usage

**Confidence:** ✅ Battle-tested approach

### Linaria

Similar approach but uses Babel plugin + webpack loader combination.

---

## Decision: Virtual Module for Webpack ✅

### Advantages

- ✅ No-codegen experience
- ✅ Flows through complete webpack pipeline
- ✅ Works with all webpack CSS plugins
- ✅ Proper optimization, minification, cache busting
- ✅ Battle-tested with astroturf
- ✅ Works with Next.js (webpack mode)

### Disadvantages

- ⚠️ Requires `webpack-virtual-modules` dependency
- ⚠️ Doesn't work with Turbopack
- ⚠️ Scanning cost on every watch trigger

### Verdict

**Use virtual modules for all webpack-based builds:**
- Pure Webpack projects ✅
- Next.js with webpack ✅
- Create React App ✅

**Use semi-codegen for Turbopack:**
- Next.js with --turbo flag ⚠️

---

## Implementation Plan

### 1. Create Webpack Plugin Package

```
packages/webpack-plugin/
├── src/
│   └── index.ts         # SilkWebpackPlugin
├── package.json
└── README.md
```

**Dependencies:**
- `webpack-virtual-modules`
- `@sylphx/silk-core` (for scanAndGenerate)

### 2. Update Next.js Plugin

```javascript
// packages/nextjs-plugin/src/index.ts
import SilkWebpackPlugin from '@sylphx/webpack-plugin-silk';

export default function silk(options = {}) {
  return {
    webpack(config, { isServer }) {
      if (!isServer) {
        config.plugins.push(new SilkWebpackPlugin(options));
      }
      return config;
    }
  }
}
```

### 3. Testing

**Test Cases:**
- ✅ Virtual module resolves correctly
- ✅ CSS flows through css-loader
- ✅ MiniCssExtractPlugin extracts CSS
- ✅ Output includes optimized CSS
- ✅ Watch mode triggers regeneration
- ✅ Next.js integration works
- ✅ PostCSS transforms applied

---

## Open Questions

### 1. Client vs Server Build

Next.js runs webpack twice (client + server). Should we:
- Generate CSS only for client build? ✅ (recommended)
- Generate for both? (unnecessary duplication)

**Decision:** Only inject virtual module in client build.

### 2. Cache Location

Store scan results for watch mode optimization?
- `.next/cache/silk/` for Next.js
- `node_modules/.cache/silk/` for generic webpack

**Decision:** Implement later if performance issue

### 3. Git Workflow

If using semi-codegen for Turbopack dev:
- Commit `silk.generated.css`? (simpler, but dirty git history)
- Gitignore it? (cleaner, but requires prebuild in CI)

**Decision:** Let users choose via documentation

---

## Conclusion

✅ **Webpack virtual modules are the correct solution for no-codegen webpack builds**

- Proven approach (astroturf uses it)
- Flows through complete CSS pipeline
- Works with Next.js webpack mode
- Simple user experience: `import 'silk.css'`

**Next Steps:**
1. ✅ Complete research (done)
2. Extract `scanAndGenerate()` to core
3. Implement webpack plugin with virtual modules
4. Test with Next.js
5. Update documentation
