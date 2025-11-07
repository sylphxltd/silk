# Next.js 16 + Turbopack + Silk Test Project

Test project for `@sylphx/swc-plugin-silk` with Next.js 16 and Turbopack.

## Setup

### 1. Build the SWC Plugin WASM Binary

First, you need to build the SWC plugin:

```bash
# Install Rust if not already installed
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add WASM target
rustup target add wasm32-wasip1

# Build the plugin
cd ../../packages/swc-plugin
cargo build --release --target wasm32-wasip1
```

This will generate the WASM binary at:
```
packages/swc-plugin/target/wasm32-wasip1/release/swc_plugin_silk.wasm
```

### 2. Install Dependencies

```bash
# In this directory
bun install

# Install Silk packages
bun add @sylphx/silk @sylphx/unplugin-silk
```

### 3. Configure Next.js

Uncomment the SWC plugin configuration in `next.config.js`:

```javascript
const nextConfig = {
  experimental: {
    swcPlugins: [
      [
        '../../packages/swc-plugin/target/wasm32-wasip1/release/swc_plugin_silk.wasm',
        {
          production: process.env.NODE_ENV === 'production',
          classPrefix: 'silk',
        }
      ]
    ]
  },
}
```

### 4. Update the Page

Uncomment the Silk imports and styles in `app/page.tsx`:

```typescript
import { css } from '@sylphx/silk'

const button = css({
  bg: 'blue',
  color: 'white',
  p: 4,
  rounded: 8,
  // ... etc
})
```

### 5. Run with Turbopack

```bash
bun run dev
```

This will start Next.js with Turbopack enabled (default in Next.js 16).

## Testing

Once set up, the SWC plugin should:

1. ✅ Transform `css()` calls to class name strings at compile time
2. ✅ Work with Turbopack (20-70x faster than Babel)
3. ✅ Generate atomic CSS classes
4. ✅ Support hot module reloading

## Verification

Check the browser DevTools:

1. **Inspect button element** - Should have classes like `silk_bg_blue_a7f3 silk_p_4_b2e1`
2. **View page source** - CSS rules should be extracted to `silk.css`
3. **Check Network tab** - Verify CSS file is loaded
4. **Test HMR** - Change styles and verify instant updates without reload

## Architecture

This test uses the **hybrid approach**:

- **SWC Plugin**: Transforms `css()` calls (fast, Turbopack-compatible)
- **Unplugin**: Collects CSS rules and generates output file

Both work together to provide full zero-runtime CSS-in-TypeScript functionality.

## Troubleshooting

### SWC Plugin Not Working

1. Verify WASM binary exists at the path in `next.config.js`
2. Check Next.js console for plugin errors
3. Try building in debug mode: `cargo build --target wasm32-wasip1`
4. Check SWC version compatibility

### CSS Not Generated

1. Verify unplugin is configured in webpack config
2. Check `public/silk.css` exists after build
3. Ensure CSS file is imported in `app/layout.tsx`

### Turbopack Issues

1. Check Next.js version is 15+ (Turbopack stable)
2. Try running without Turbopack: `next dev` (should still work with SWC plugin)
3. Check for conflicting webpack plugins

## Next Steps

After successful testing:

1. Add integration tests
2. Test edge cases (nested objects, pseudo-selectors, responsive values)
3. Benchmark performance vs Babel plugin
4. Publish plugin to npm
