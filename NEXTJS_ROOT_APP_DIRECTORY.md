# Next.js Root-Level `app/` Directory Configuration

## Problem

If your Next.js project uses a **root-level `app/` directory** instead of `src/app/`, Silk 3.0.0-3.0.2 would fail with:

```
Error: ENOENT: no such file or directory, scandir './src'
```

## Solution (Fixed in 3.0.3+)

### 1. Configure `srcDir` in `next.config.mjs`

```javascript
// next.config.mjs
import { withSilk } from '@sylphx/silk-nextjs';

export default withSilk({
  // Your Next.js config
}, {
  // Silk config - specify root-level app directory
  srcDir: './app',
  debug: true  // Optional: enable debug logging
});
```

### 2. Import Silk CSS in your root layout

```typescript
// app/layout.tsx
import 'silk.css';  // Virtual module provided by webpack plugin

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### 3. Use Silk styles in your components

```typescript
// app/page.tsx
import { css } from '@sylphx/silk';

const styles = {
  container: css({
    display: 'flex',
    padding: '2rem',
    background: '#667eea'
  })
};

export default function Home() {
  return <div className={styles.container}>Hello Silk!</div>;
}
```

## Supported Directory Structures

Silk now supports all Next.js directory structures:

### ✅ Root-level `app/` directory
```
my-app/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── next.config.mjs  ← srcDir: './app'
└── package.json
```

### ✅ `src/app/` directory (default)
```
my-app/
├── src/
│   └── app/
│       ├── layout.tsx
│       └── page.tsx
├── next.config.mjs  ← srcDir: './src' (or omit, this is default)
└── package.json
```

### ✅ Custom source directory
```
my-app/
├── client/
│   └── app/
│       ├── layout.tsx
│       └── page.tsx
├── next.config.mjs  ← srcDir: './client'
└── package.json
```

## What Was Fixed in 3.0.3

1. **✅ srcDir parameter now works correctly**
   - Previously: `srcDir` option was ignored
   - Now: Properly configurable via `withSilk()` second argument

2. **✅ lightningcss-wasm no longer bundled to client**
   - Previously: Caused `Module not found: Can't resolve 'child_process'` error
   - Now: Added to webpack externals on client builds

3. **✅ Debug logging shows srcDir**
   - Enable `debug: true` to verify configuration:
   ```
   [Silk] Webpack mode: Injecting SilkWebpackPlugin
   [Silk] isServer: false
   [Silk] srcDir: ./app
   ```

## Migration from 3.0.0-3.0.2

If you encountered the `./src` directory error:

**Before (3.0.0-3.0.2):**
```javascript
// Didn't work - srcDir was ignored
export default withSilk({}, { srcDir: './app' });
```

**After (3.0.3+):**
```javascript
// Now works correctly!
export default withSilk({}, { srcDir: './app' });
```

## Turbopack Mode (Experimental)

For Turbopack, use CLI mode with appropriate srcDir:

```json
// package.json
{
  "scripts": {
    "predev": "silk generate --src ./app",
    "dev": "next dev --turbo"
  }
}
```

```javascript
// next.config.mjs
export default withSilk({}, {
  turbopack: true,
  srcDir: './app'
});
```

```typescript
// app/layout.tsx
import '../app/silk.generated.css';  // Physical file, not virtual module
```
