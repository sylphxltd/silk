---
"@sylphx/silk-nextjs": minor
---

Make SWC plugin automatically included as optional dependency

**BREAKING CHANGE for users who manually installed both packages:**
- Previously: `bun add @sylphx/silk-nextjs @sylphx/swc-plugin-silk`
- Now: `bun add @sylphx/silk-nextjs` (auto-includes SWC plugin)

**Benefits:**
- ✅ One package to install instead of two
- ✅ SWC plugin auto-installed as optionalDependency
- ✅ Automatic Turbopack optimization (20-70x faster)
- ✅ Zero configuration needed
- ✅ Falls back to Babel if SWC unavailable

**Migration:**
If you previously installed both packages:
```bash
# Remove SWC plugin from package.json
bun remove @sylphx/swc-plugin-silk

# Update Next.js plugin (includes SWC automatically)
bun add @sylphx/silk-nextjs@latest
```

No code changes needed - automatic detection continues to work.
