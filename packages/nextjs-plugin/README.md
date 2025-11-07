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
// next.config.js
import { withSilk } from '@sylphx/silk-nextjs'

export default withSilk({
  // Your Next.js config
}, {
  // Silk config
  appRouter: true,           // Enable App Router optimizations
  rsc: true,                 // React Server Components support
  criticalCSS: true,         // Extract critical CSS
  brotli: true,              // Pre-compress CSS (15-25% smaller)
})
```

### 2. Create Silk Config

```typescript
// app/silk.config.ts
import { defineConfig } from '@sylphx/silk'
import { createSilkReact } from '@sylphx/silk-nextjs'

export const { styled, Box, css } = createSilkReact(
  defineConfig({
    colors: {
      brand: { 500: '#3b82f6' }
    },
    spacing: { 4: '1rem' }
  })
)
```

### 3. Use in Components

```typescript
// app/components/Button.tsx
'use client' // or 'use server'

import { styled } from '../silk.config'

export const Button = styled('button', {
  bg: 'brand.500',
  px: 4,
  py: 2,
  _hover: { opacity: 0.8 }
})
```

## Features

### ✅ App Router Support
- Full Next.js 13+ App Router compatibility
- Automatic CSS extraction during SSR
- Server Components ready

### ✅ React Server Components (RSC)
- Zero runtime overhead for server components
- CSS extracted at build time
- Client components work seamlessly

### ✅ Critical CSS
- Automatic critical CSS extraction
- Faster first contentful paint
- Route-based CSS splitting

### ✅ Performance
- Brotli pre-compression (15-25% smaller)
- LightningCSS optimization (5-10x faster)
- Atomic CSS deduplication (10-20% smaller)

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
import { Box } from './silk.config'

export default function Home() {
  return (
    <Box px={4} py={6}>
      <h1>Welcome to Silk + Next.js!</h1>
    </Box>
  )
}
```

## Server Components

```typescript
// app/components/ServerCard.tsx
// No 'use client' - this is a server component!

import { Box } from '../silk.config'

export function ServerCard({ title, children }) {
  // Styles are extracted at build time
  // Zero runtime overhead!
  return (
    <Box p={4} rounded="lg" bg="white" shadow="md">
      <h2>{title}</h2>
      {children}
    </Box>
  )
}
```

## Configuration Options

```typescript
interface SilkNextConfig {
  // Output CSS file path
  outputFile?: string        // default: 'silk.css'

  // Enable App Router optimizations
  appRouter?: boolean        // default: true

  // Enable React Server Components
  rsc?: boolean              // default: true

  // Extract critical CSS
  criticalCSS?: boolean      // default: true

  // Production optimizations
  production?: boolean       // default: true in production

  // Brotli pre-compression
  brotli?: boolean           // default: true

  // Inject CSS into _document
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
