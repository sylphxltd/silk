# @sylphx/silk-remix

Remix integration for Silk - zero-runtime CSS-in-TypeScript with **streaming SSR** and **critical CSS** support.

## Installation

```bash
npm install @sylphx/silk-remix
# or
bun add @sylphx/silk-remix
```

## Quick Start

### 1. Configure Silk

```typescript
// app/silk.config.ts
import { defineConfig } from '@sylphx/silk'
import { createSilkReact } from '@sylphx/silk-remix'

export const { styled, Box, css } = createSilkReact(
  defineConfig({
    colors: {
      brand: { 500: '#3b82f6' }
    },
    spacing: { 4: '1rem' }
  })
)
```

### 2. Setup Entry Server

```typescript
// app/entry.server.tsx
import { renderToString } from 'react-dom/server'
import { RemixServer } from '@remix-run/react'
import type { EntryContext } from '@remix-run/node'
import { SilkProvider, extractCriticalCSS } from '@sylphx/silk-remix'

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  // Extract critical CSS during SSR
  const { css, cleanup } = extractCriticalCSS()

  const markup = renderToString(
    <SilkProvider css={css}>
      <RemixServer context={remixContext} url={request.url} />
    </SilkProvider>
  )

  // Cleanup after rendering
  cleanup()

  responseHeaders.set('Content-Type', 'text/html')

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
```

### 3. Add Links to Root

```typescript
// app/root.tsx
import { Links, LiveReload, Meta, Outlet, Scripts } from '@remix-run/react'
import type { LinksFunction } from '@remix-run/node'
import { silkLinks } from '@sylphx/silk-remix'

export const links: LinksFunction = () => [
  ...silkLinks(),
]

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
```

### 4. Use in Routes

```typescript
// app/routes/index.tsx
import { Box } from '~/silk.config'

export default function Index() {
  return (
    <Box px={4} py={6}>
      <h1>Welcome to Silk + Remix!</h1>
    </Box>
  )
}
```

## Features

### ✅ Streaming SSR
- CSS extracted during server-side rendering
- Progressive rendering with streaming
- Zero runtime overhead

### ✅ Critical CSS
- Automatic critical CSS extraction
- Inlined in HTML for faster first paint
- Route-based CSS splitting

### ✅ Performance
- Brotli pre-compression (15-25% smaller)
- LightningCSS optimization (5-10x faster)
- Atomic CSS deduplication (10-20% smaller)

### ✅ Developer Experience
- Full TypeScript support
- Zero codegen required
- Hot module replacement (HMR)

## Advanced Usage

### Route-Specific CSS

```typescript
// app/routes/dashboard.tsx
import { extractCriticalCSS } from '@sylphx/silk-remix'
import type { LoaderFunction } from '@remix-run/node'

export const loader: LoaderFunction = async ({ request }) => {
  // Extract CSS for this route only
  const { css } = extractCriticalCSS()

  return json({
    css,
    // ... other data
  })
}
```

### Streaming CSS

```typescript
import { getSilkConfig } from '@sylphx/silk-remix'

const config = getSilkConfig({
  streaming: true
})

// Stream CSS chunks for progressive rendering
for await (const chunk of config.remix.streamCSS()) {
  // Send chunk to client
}
```

## Configuration Options

```typescript
interface SilkRemixConfig {
  // Enable critical CSS extraction
  criticalCSS?: boolean      // default: true

  // Enable streaming SSR optimizations
  streaming?: boolean        // default: true

  // Output CSS file
  outputFile?: string        // default: 'silk.css'

  // Production optimizations
  production?: boolean       // default: true in production

  // Brotli pre-compression
  brotli?: boolean           // default: true
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
