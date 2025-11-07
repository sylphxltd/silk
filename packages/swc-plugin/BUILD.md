# Building the SWC Plugin

Complete guide for building `@sylphx/swc-plugin-silk` from source.

## Prerequisites

### 1. Install Rust

**macOS / Linux:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

**Windows:**
Download and run [rustup-init.exe](https://rustup.rs/)

**Verify installation:**
```bash
rustc --version
cargo --version
```

### 2. Add WASM Target

SWC plugins must compile to WebAssembly:

```bash
rustup target add wasm32-wasip1
```

**Verify target installed:**
```bash
rustup target list --installed | grep wasm32-wasip1
```

### 3. Optional: Install AssemblyScript

The AssemblyScript code is reference implementation only, not required for building:

```bash
cd assemblyscript
npm install
npm run asbuild
```

## Building

### Quick Build (Release)

```bash
cargo build --release --target wasm32-wasip1
```

**Output:**
```
target/wasm32-wasip1/release/swc_plugin_silk.wasm
```

### Development Build (Debug)

For faster iteration during development:

```bash
cargo build --target wasm32-wasip1
```

**Output:**
```
target/wasm32-wasip1/debug/swc_plugin_silk.wasm
```

Debug builds are ~2x larger but compile faster.

### Full Build (Both)

Build both AssemblyScript reference and Rust plugin:

```bash
npm run build
```

This runs:
1. `cd assemblyscript && npm run asbuild` (reference only)
2. `cargo build --release --target wasm32-wasip1` (actual plugin)

## Testing

### Unit Tests

```bash
cargo test
```

Runs all Rust unit tests including:
- Property shorthand resolution
- camelCase to kebab-case conversion
- CSS value normalization
- Hash generation
- Class name generation

### Integration Tests

See the Next.js 16 test project:

```bash
cd ../../examples/nextjs-16-turbopack
bun install
bun run dev
```

## Optimization Levels

### Profile Comparison

| Profile | Size | Build Time | Performance |
|---------|------|------------|-------------|
| Debug | ~2MB | 10s | Same |
| Release | ~800KB | 60s | Same |
| Release + LTO | ~600KB | 120s | Same |

**Current settings** (Cargo.toml):
```toml
[profile.release]
lto = true              # Link-time optimization
opt-level = 3           # Maximum optimization
```

### Size Optimization

To minimize WASM size further:

```toml
[profile.release]
lto = true
opt-level = "z"         # Optimize for size
codegen-units = 1       # Better optimization
strip = true            # Remove debug symbols
panic = "abort"         # Smaller panic handling
```

Then rebuild:
```bash
cargo build --release --target wasm32-wasip1
```

## Troubleshooting

### `cargo: command not found`

Rust is not installed or not in PATH.

**Fix:**
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add to PATH (macOS/Linux)
source $HOME/.cargo/env

# Or permanently add to shell profile
echo 'source $HOME/.cargo/env' >> ~/.bashrc
```

### `error: can't find crate for 'swc_core'`

Dependencies not downloaded.

**Fix:**
```bash
cargo fetch
cargo build --release --target wasm32-wasip1
```

### `error: target 'wasm32-wasip1' not found`

WASM target not installed.

**Fix:**
```bash
rustup target add wasm32-wasip1
```

### Build is slow

This is normal for Rust release builds with LTO enabled.

**Options:**
1. Use debug builds during development: `cargo build --target wasm32-wasip1`
2. Disable LTO temporarily: Remove `lto = true` from Cargo.toml
3. Use `cargo watch` for incremental builds:
   ```bash
   cargo install cargo-watch
   cargo watch -x 'build --target wasm32-wasip1'
   ```

### WASM binary too large

**Check current size:**
```bash
ls -lh target/wasm32-wasip1/release/swc_plugin_silk.wasm
```

**Optimize further:**
1. Use size optimization profile (see above)
2. Run `wasm-opt` (from binaryen):
   ```bash
   npm install -g binaryen
   wasm-opt -Oz target/wasm32-wasip1/release/swc_plugin_silk.wasm -o optimized.wasm
   ```

## Publishing

Before publishing to npm:

1. **Build release binary:**
   ```bash
   npm run build
   ```

2. **Verify files to be published:**
   ```bash
   npm pack --dry-run
   ```

3. **Test installation locally:**
   ```bash
   npm pack
   npm install -g sylphx-swc-plugin-silk-0.1.0.tgz
   ```

4. **Publish:**
   ```bash
   npm publish
   ```

The `package.json` `files` field specifies what gets published:
```json
"files": [
  "target/wasm32-wasip1/release/*.wasm",
  "README.md",
  "LICENSE"
]
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Build SWC Plugin

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Rust
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
          target: wasm32-wasip1

      - name: Build
        run: |
          cd packages/swc-plugin
          cargo build --release --target wasm32-wasip1

      - name: Test
        run: cargo test

      - name: Upload WASM
        uses: actions/upload-artifact@v3
        with:
          name: swc-plugin-wasm
          path: packages/swc-plugin/target/wasm32-wasip1/release/*.wasm
```

## Performance Tips

### Parallel Builds

Use multiple cores:
```bash
cargo build --release --target wasm32-wasip1 -j 8
```

### Caching

Cache cargo registry and target directory:
```bash
# ~/.cargo/config.toml
[build]
incremental = true
```

### Clean Builds

If you encounter weird errors:
```bash
cargo clean
cargo build --release --target wasm32-wasip1
```

## Next Steps

After building:

1. Test with Next.js 16 project (see `examples/nextjs-16-turbopack/README.md`)
2. Run integration tests
3. Benchmark performance vs Babel plugin
4. Publish to npm

## Resources

- [SWC Plugin Documentation](https://swc.rs/docs/plugin/ecmascript/getting-started)
- [Rust Book](https://doc.rust-lang.org/book/)
- [WASM Documentation](https://webassembly.org/getting-started/developers-guide/)
- [Cargo Book](https://doc.rust-lang.org/cargo/)
