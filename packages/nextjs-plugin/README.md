# @sylphx/silk-nextjs

Next.js integration for Silk - zero-runtime CSS-in-TypeScript with **App Router** and **React Server Components** support.

## Installation

```bash
npm install @sylphx/silk-nextjs
# or
bun add @sylphx/silk-nextjs
```

## Quick Start

### 1. Configure Next.js

```typescript
// next.config.js (or .mjs)
import { withSilk } from '@sylphx/silk-nextjs'

export default withSilk({
  // Your Next.js config
}, {
  // Silk options
  outputFile: 'silk.css',
  babelOptions: {
    production: true,
    classPrefix: 'silk',
  },
  compression: {
    brotli: true,            // Pre-compress CSS (15-25% smaller)
    gzip: true,
  }
})
```

### 2. Use in Components

```typescript
// app/components/Button.tsx
'use client'

import { css } from '@sylphx/silk'

const button = css({
  bg: 'blue',
  color: 'white',
  px: 4,
  py: 2,
  rounded: 8,
  _hover: { opacity: 0.8 }
})

export function Button({ children }) {
  return <button className={button}>{children}</button>
}
```

### 3. Import CSS in Layout

```typescript
// app/layout.tsx
import './silk.css'  // CSS is generated at build time

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

## Features

### ✅ Zero-Runtime Compilation
- CSS extracted at build time via Babel plugin
- No runtime CSS-in-JS overhead
- Static atomic class names

### ✅ App Router Support
- Full Next.js 13+ App Router compatibility
- Works with Pages Router too
- Server and Client Components supported

### ✅ React Server Components (RSC)
- Zero runtime overhead
- CSS extracted during build
- True zero-bundle for server components

### ✅ Performance
- **-6.5KB JS bundle** (runtime code eliminated)
- **Brotli compression** (389B for 1KB CSS, -61%)
- **Atomic CSS** (one class per property)
- **Fast builds** (Babel transformation)

## App Router Example

```typescript
// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Silk + Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

```typescript
// app/page.tsx
import { css } from '@sylphx/silk'

const container = css({ px: 4, py: 6 })

export default function Home() {
  return (
    <div className={container}>
      <h1>Welcome to Silk + Next.js!</h1>
    </div>
  )
}
```

## Server Components

```typescript
// app/components/ServerCard.tsx
// No 'use client' - this is a server component!

import { css } from '@sylphx/silk'

const card = css({
  p: 4,
  rounded: 'lg',
  bg: 'white',
  shadow: 'md'
})

export function ServerCard({ title, children }) {
  // Styles are extracted at build time
  // Zero runtime overhead!
  return (
    <div className={card}>
      <h2>{title}</h2>
      {children}
    </div>
  )
}
```

## Configuration Options

```typescript
interface SilkNextConfig {
  // Output CSS file path
  outputFile?: string        // default: 'silk.css'

  // Minify CSS output
  minify?: boolean           // default: true in production

  // Babel plugin options
  babelOptions?: {
    production?: boolean     // default: NODE_ENV === 'production'
    classPrefix?: string     // default: 'silk'
    importSources?: string[] // default: ['@sylphx/silk']
  }

  // Compression options
  compression?: {
    brotli?: boolean         // default: true
    brotliQuality?: number   // default: 11 (0-11)
    gzip?: boolean           // default: true
    gzipLevel?: number       // default: 9 (0-9)
  }

  // Inject CSS link into HTML
  inject?: boolean           // default: true
}
```

## Ecosystem

- **[@sylphx/silk](https://www.npmjs.com/package/@sylphx/silk)** - Core styling system
- **[@sylphx/silk-react](https://www.npmjs.com/package/@sylphx/silk-react)** - React bindings
- **[@sylphx/silk-vite-plugin](https://www.npmjs.com/package/@sylphx/silk-vite-plugin)** - Vite plugin

## Documentation

Full documentation: [GitHub Repository](https://github.com/sylphxltd/silk)

## License

MIT © [SylphX Ltd](https://sylphx.com)
