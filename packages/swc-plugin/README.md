# @sylphx/swc-plugin-silk

> **Internal Build Dependency**
>
> This package is not published to npm. It's a build dependency for [@sylphx/silk-nextjs](https://www.npmjs.com/package/@sylphx/silk-nextjs).

---

## Architecture

**This is the Rust/WASM source code for Silk's SWC plugin:**

```
packages/
├── swc-plugin/              # This package (Rust source)
│   ├── src/lib.rs          # Core SWC plugin logic
│   └── tests/              # 26 tests
│
└── nextjs-plugin/          # Published npm package
    └── dist/
        └── swc_plugin_silk.wasm  # Compiled from this source
```

## For Users

**You don't need this package directly.** Install the Next.js plugin instead:

```bash
npm install @sylphx/silk-nextjs
```

The WASM plugin is bundled with `@sylphx/silk-nextjs`, which automatically:
- ✅ Uses Babel plugin for Webpack builds
- ✅ Uses this SWC plugin (WASM) for Turbopack builds
- ✅ Detects build mode automatically
- ✅ No configuration needed

## For Contributors

This package contains the Rust source code that compiles to WASM.

### Build

```bash
# Build WASM
cargo build --release --target wasm32-wasip1

# Run tests
cargo test
```

### Development Workflow

1. **Modify Rust code** in `src/lib.rs`
2. **Run tests** with `cargo test`
3. **Build Next.js plugin** which copies WASM:
   ```bash
   cd ../nextjs-plugin
   bun run build  # Builds Rust WASM + TypeScript
   ```
4. **Publish Next.js plugin** (not this package):
   ```bash
   bun changeset
   # Select @sylphx/silk-nextjs (not swc-plugin-silk)
   ```

### Key Implementation Details

**MurmurHash2 + Base-36 Encoding:**
```rust
fn murmur_hash2(s: &str) -> String {
    let mut h: u32 = 0;
    for ch in s.chars() {
        let c = ch as u32;
        h = (h ^ c).wrapping_mul(0x5bd1e995);
        h ^= h >> 13;
    }
    base36_encode(h)
}
```

**Digit Mapping for CSS Validity:**
```rust
// Ensure class names start with letters (0→g, 1→h, ..., 9→p)
if first_char >= '0' && first_char <= '9' {
    let mapped_char = (b'g' + (first_char as u8 - b'0')) as char;
    short_hash = format!("{}{}", mapped_char, &short_hash[1..]);
}
```

## Tests

**26 tests covering:**
- 16 unit tests (lib.rs)
- 10 integration tests (tests/integration.rs)

```bash
cargo test
```

## Performance

**20-70x faster than Babel plugin** when used in Turbopack mode.

## License

MIT © [SylphX Ltd](https://sylphx.com)
