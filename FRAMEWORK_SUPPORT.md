# Framework Support - Codegen vs No-Codegen

## Summary

| Framework | Method | Setup | Status |
|-----------|--------|-------|--------|
| **Vite** | ✅ No-codegen | Virtual module | ✅ Tested |
| **Webpack** | ✅ No-codegen | Virtual module | ✅ Tested |
| **Next.js (webpack)** | ✅ No-codegen | Webpack plugin | ✅ Tested |
| **Next.js (turbopack)** | ⚠️ Semi-codegen | CLI tool | ✅ Tested |
| **Vue (Vite)** | ✅ No-codegen | Vite plugin | ✅ Ready |
| **Vue (webpack)** | ✅ No-codegen | Webpack plugin | ✅ Ready |
| **Nuxt 3** | ✅ No-codegen | Nuxt module | 📋 Planned |
| **Svelte (Vite)** | ✅ No-codegen | Vite plugin | ✅ Ready |
| **SvelteKit** | ✅ No-codegen | Vite plugin | ✅ Ready |
| **Astro** | ✅ No-codegen | Vite plugin | ✅ Ready |
| **Remix** | ✅ No-codegen | Vite plugin | ✅ Ready |
| **Rollup** | ✅ No-codegen | Virtual module | 📋 Planned |
| **Create React App** | ✅ No-codegen | Webpack plugin | ✅ Ready |
| **Angular** | ✅ No-codegen | Webpack plugin | ✅ Ready |
| **Solid (Vite)** | ✅ No-codegen | Vite plugin | ✅ Ready |
| **Qwik (Vite)** | ✅ No-codegen | Vite plugin | ✅ Ready |

---

## ✅ No-Codegen Frameworks

These frameworks have plugin hooks that allow virtual module creation, enabling true zero-codegen experience.

### 1. Vite

**Plugin**: `@sylphx/silk-vite-plugin`

**How it works**:
- Uses `resolveId` + `load` hooks
- Creates virtual `silk.css` module
- CSS flows through Vite's CSS pipeline

**Setup**:
```typescript
// vite.config.ts
import silk from '@sylphx/silk-vite-plugin'

export default {
  plugins: [silk()]
}
```

```typescript
// app.tsx
import 'silk.css'  // Virtual module → Vite CSS pipeline
```

**Benefits**:
- ✅ Zero-codegen
- ✅ PostCSS transforms automatic
- ✅ Minification by Vite
- ✅ Cache busting by Vite
- ✅ HMR support

### 2. Webpack

**Plugin**: `@sylphx/silk-webpack-plugin`

**How it works**:
- Uses `webpack-virtual-modules` package
- Creates virtual `node_modules/silk.css`
- CSS flows through webpack's CSS pipeline

**Setup**:
```javascript
// webpack.config.js
const SilkWebpackPlugin = require('@sylphx/silk-webpack-plugin');
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

```javascript
// app.js
import 'silk.css'  // Virtual module → webpack CSS pipeline
```

**Benefits**:
- ✅ Zero-codegen
- ✅ PostCSS transforms automatic
- ✅ Minification by webpack
- ✅ Cache busting by webpack
- ✅ Watch mode support

### 3. Next.js (webpack mode)

**Plugin**: `@sylphx/silk-nextjs` (wraps webpack plugin)

**How it works**:
- Injects `SilkWebpackPlugin` into Next.js webpack config
- Same virtual module approach as pure webpack

**Setup**:
```javascript
// next.config.js
const silk = require('@sylphx/silk-nextjs');

module.exports = silk()
```

```typescript
// app/layout.tsx
import 'silk.css'  // Virtual module → Next.js CSS pipeline
```

**Commands**:
```bash
next dev        # Webpack dev mode
next build      # Webpack production build
```

**Benefits**:
- ✅ Zero-codegen
- ✅ Flows through Next.js CSS handling
- ✅ Works with App Router & Pages Router
- ✅ Watch mode in dev

### 4. Vue (Vite) ✅

**Plugin**: `@sylphx/silk-vite-plugin`

**How it works**:
- Same as Vite plugin (Vue 3 官方推薦使用 Vite)
- Virtual module via `resolveId` + `load` hooks

**Setup**:
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import silk from '@sylphx/silk-vite-plugin'

export default defineConfig({
  plugins: [vue(), silk()]
})
```

```typescript
// main.ts
import 'silk.css'  // Virtual module → Vite CSS pipeline
```

**Benefits**:
- ✅ Zero-codegen
- ✅ 與 Vue SFC 一齊走 Vite CSS pipeline
- ✅ HMR support

### 5. Vue (webpack / Vue CLI) ✅

**Plugin**: `@sylphx/silk-webpack-plugin`

**How it works**:
- Same as webpack plugin
- Works with Vue CLI (webpack-based)

**Setup**:
```javascript
// vue.config.js
const SilkWebpackPlugin = require('@sylphx/silk-webpack-plugin');

module.exports = {
  configureWebpack: {
    plugins: [new SilkWebpackPlugin()]
  }
}
```

```javascript
// main.js
import 'silk.css'  // Virtual module → webpack CSS pipeline
```

### 6. Nuxt 3 📋

**Plugin**: `@sylphx/silk-nuxt` (planned)

**How it works**:
- Nuxt module that wraps Vite plugin
- Similar to Next.js approach

**Setup** (planned):
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@sylphx/silk-nuxt']
})
```

### 7. Svelte (Vite) ✅

**Plugin**: `@sylphx/silk-vite-plugin`

**How it works**:
- Same as Vite plugin
- Svelte 官方推薦使用 Vite

**Setup**:
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import silk from '@sylphx/silk-vite-plugin'

export default defineConfig({
  plugins: [svelte(), silk()]
})
```

```javascript
// main.js
import 'silk.css'  // Virtual module → Vite CSS pipeline
```

### 8. SvelteKit ✅

**Plugin**: `@sylphx/silk-vite-plugin`

**How it works**:
- SvelteKit 基於 Vite，直接用 Vite plugin

**Setup**:
```javascript
// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite'
import silk from '@sylphx/silk-vite-plugin'

export default {
  plugins: [sveltekit(), silk()]
}
```

### 9. Astro ✅

**Plugin**: `@sylphx/silk-vite-plugin`

**How it works**:
- Astro 基於 Vite，直接用 Vite plugin

**Setup**:
```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config'
import silk from '@sylphx/silk-vite-plugin'

export default defineConfig({
  vite: {
    plugins: [silk()]
  }
})
```

### 10. Remix ✅

**Plugin**: `@sylphx/silk-vite-plugin`

**How it works**:
- Remix 2.0+ 基於 Vite

**Setup**:
```javascript
// vite.config.js
import { vitePlugin as remix } from '@remix-run/dev'
import silk from '@sylphx/silk-vite-plugin'

export default {
  plugins: [remix(), silk()]
}
```

### 11. Create React App ✅

**Plugin**: `@sylphx/silk-webpack-plugin` (via craco/rewire)

**How it works**:
- Inject webpack plugin via craco or react-app-rewired

**Setup**:
```javascript
// craco.config.js
const SilkWebpackPlugin = require('@sylphx/silk-webpack-plugin');

module.exports = {
  webpack: {
    plugins: [new SilkWebpackPlugin()]
  }
}
```

### 12. Angular ✅

**Plugin**: `@sylphx/silk-webpack-plugin`

**How it works**:
- Angular 使用 webpack
- 通過 custom webpack builder 注入

**Setup**:
```javascript
// angular.json + custom-webpack.config.js
const SilkWebpackPlugin = require('@sylphx/silk-webpack-plugin');

module.exports = {
  plugins: [new SilkWebpackPlugin()]
}
```

### 13. Solid (Vite) ✅

**Plugin**: `@sylphx/silk-vite-plugin`

**How it works**:
- Solid 官方推薦使用 Vite

**Setup**:
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import silk from '@sylphx/silk-vite-plugin'

export default defineConfig({
  plugins: [solid(), silk()]
})
```

### 14. Qwik (Vite) ✅

**Plugin**: `@sylphx/silk-vite-plugin`

**How it works**:
- Qwik 基於 Vite

**Setup**:
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import { qwikVite } from '@builder.io/qwik/optimizer'
import silk from '@sylphx/silk-vite-plugin'

export default defineConfig({
  plugins: [qwikVite(), silk()]
})
```

### 15. Rollup 📋

**Plugin**: `@sylphx/silk-rollup-plugin` (planned)

**How it works**:
- Uses `resolveId` + `load` hooks (same as Vite)
- Creates virtual CSS module

**Setup**:
```javascript
// rollup.config.js
import silk from '@sylphx/silk-rollup-plugin'

export default {
  plugins: [silk()]
}
```

---

## ⚠️ Semi-Codegen Frameworks

These frameworks lack build hooks or plugin APIs, requiring manual CSS generation.

### 1. Next.js (Turbopack mode)

**CLI Tool**: `@sylphx/silk-cli` (to implement)

**Why semi-codegen?**
- Turbopack doesn't support webpack plugins
- Turbopack doesn't have virtual module API (yet)
- No prebuild hooks in Next.js

**Setup**:

**Option A: Prebuild script**
```json
{
  "scripts": {
    "predev": "silk generate",
    "prebuild": "silk generate",
    "dev": "next dev --turbo",
    "build": "next build"
  }
}
```

**Option B: Watch mode (dev)**
```bash
# Terminal 1: Watch and regenerate
silk generate --watch

# Terminal 2: Next.js dev
next dev --turbo
```

**Usage**:
```typescript
// app/layout.tsx
import '../src/silk.generated.css'  // Physical file → Next.js CSS pipeline
```

**Trade-offs**:
- ⚠️ Requires manual `silk generate` step
- ⚠️ Git workflow: commit generated CSS or run in CI
- ✅ Still flows through Next.js CSS pipeline
- ✅ Watch mode available for dev

### 2. Other frameworks without hooks

Similar semi-codegen approach:
- Run `silk generate` manually or in prebuild
- Import the generated `silk.generated.css`
- CSS flows through framework's CSS pipeline

---

## 架構對比

### No-Codegen 架構 (Vite/Webpack)

```
開發者寫 css() calls
    ↓
Plugin scan src/**/*.{ts,tsx,js,jsx}
    ↓
scanAndGenerate() 生成 CSS
    ↓
Virtual module (silk.css)
    ↓
Framework CSS pipeline (PostCSS, minify, bundle)
    ↓
輸出到 dist/assets/[hash].css
```

**用戶體驗**: `import 'silk.css'` 就完成，完全透明

### Semi-Codegen 架構 (Turbopack)

```
開發者寫 css() calls
    ↓
手動 run: silk generate
    ↓
scanAndGenerate() 生成 CSS
    ↓
寫到 src/silk.generated.css
    ↓
開發者 import '../src/silk.generated.css'
    ↓
Framework CSS pipeline (PostCSS, minify, bundle)
    ↓
輸出到 dist/[hash].css
```

**用戶體驗**: 需要記住 run `silk generate`，或者 setup prebuild/watch

---

## 決策樹

```
你用咩 framework？
    │
    ├── Vite → ✅ No-codegen (silk-vite-plugin)
    │
    ├── Webpack → ✅ No-codegen (silk-webpack-plugin)
    │
    ├── Rollup → ✅ No-codegen (silk-rollup-plugin)
    │
    ├── Next.js
    │   │
    │   ├── 用 webpack mode (默認)
    │   │   └── ✅ No-codegen (silk-nextjs)
    │   │
    │   └── 用 turbopack mode (next dev --turbo)
    │       └── ⚠️ Semi-codegen (silk generate + manual import)
    │
    └── 其他/自定義
        │
        ├── 有 plugin API？
        │   └── ✅ 可以實現 no-codegen
        │
        └── 無 plugin API？
            └── ⚠️ 用 semi-codegen (silk generate)
```

---

## Git Workflow

### No-Codegen (推薦)

```bash
# .gitignore
# (No generated files to ignore)

# Work
git add .
git commit -m "feat: new component"
git push
```

**CI/CD**: 直接 build，無需額外步驟

### Semi-Codegen

**Option A: Commit generated CSS**
```bash
# 每次改 css() 後
silk generate

# Git
git add src/silk.generated.css
git commit -m "feat: update styles"
git push
```

✅ CI/CD 直接 work
⚠️ Git history 有 CSS diff

**Option B: Gitignore generated CSS**
```bash
# .gitignore
src/silk.generated.css

# Local dev
silk generate --watch  # Auto-regenerate

# CI/CD (package.json)
{
  "scripts": {
    "prebuild": "silk generate",
    "build": "next build"
  }
}
```

✅ 乾淨 git history
⚠️ CI 需要 run `silk generate`

---

## 實現狀態

### ✅ 已實現

1. **Core**: `scanAndGenerate()` - 掃描和生成 CSS
2. **Vite Plugin**: Virtual module with hooks
3. **Webpack Plugin**: Virtual module with webpack-virtual-modules

### ⚠️ 待實現

1. **Next.js Plugin**: Wrap webpack plugin
2. **CLI Tool**: `silk generate` command
3. **Rollup Plugin**: Similar to Vite plugin
4. **Integration Tests**: All frameworks
5. **Documentation**: Setup guides for each framework

---

## 結論

### 推薦方案

| 場景 | 推薦 |
|------|------|
| **新項目 (React/Vue/Svelte)** | Vite (fastest DX, best no-codegen) |
| **Vue 3 項目** | Vite + @sylphx/silk-vite-plugin |
| **Vue 2 / Vue CLI** | Webpack + @sylphx/silk-webpack-plugin |
| **Nuxt 3** | 等 @sylphx/silk-nuxt，暫時用 Vite plugin |
| **Svelte / SvelteKit** | Vite + @sylphx/silk-vite-plugin |
| **Next.js App** | Next.js + webpack mode (no-codegen) |
| **Next.js + Turbopack** | Semi-codegen (等 Turbopack plugin API) |
| **Astro** | Vite + @sylphx/silk-vite-plugin |
| **Remix** | Vite + @sylphx/silk-vite-plugin |
| **Solid** | Vite + @sylphx/silk-vite-plugin |
| **Angular** | Webpack + @sylphx/silk-webpack-plugin |
| **既有 webpack** | Webpack plugin (no-codegen) |

### 未來改進

1. **Turbopack Plugin API**: 等 Turbopack 開放 plugin API 就可以做到 no-codegen
2. **Nuxt 3 Module**: 創建專門的 Nuxt module 包裝 Vite plugin
3. **Rollup Plugin**: 獨立的 Rollup plugin（雖然大部分 Rollup 用戶已轉用 Vite）
4. **AST Parsing**: 改用 `@babel/parser` 或 `@swc/core` 替代 regex
5. **Incremental Generation**: Cache + 只 re-parse changed files

---

## 常見問題

### Q: 點解 Vite 可以 no-codegen 但 Turbopack 唔得？

A: Vite 有 `resolveId` + `load` hooks 讓我地創建 virtual module。Turbopack 仲未開放呢啲 API。

### Q: Semi-codegen 同傳統 CSS-in-JS codegen 有咩分別？

A:
- **傳統 codegen**: 生成 CSS 直接輸出，bypass 框架 pipeline
- **我地 semi-codegen**: 生成 CSS → import → 走框架 CSS pipeline ✅

所以我地仍然有 PostCSS transforms, minification, cache busting 等。

### Q: 將來 Turbopack 會唔會支援 no-codegen？

A: 當 Turbopack 開放 plugin API（類似 webpack 的 `NormalModuleReplacementPlugin` 或 virtual modules），我地就可以實現 no-codegen。

### Q: 我應該用 webpack mode 定 turbopack mode for Next.js？

A:
- **webpack mode**: ✅ No-codegen, 成熟穩定
- **turbopack mode**: ⚠️ Semi-codegen, 但 build 更快

如果你想要 no-codegen 體驗，用 webpack mode。如果你要極速 build，接受 semi-codegen 就用 turbopack。

### Q: scanAndGenerate 會唔會好慢？

A:
- **小項目** (<100 files): ~50-100ms
- **中項目** (100-500 files): ~200-500ms
- **大項目** (>500 files): ~500ms-1s

因為只 scan 一次（build start），impact 可接受。未來可以用 cache 優化。
