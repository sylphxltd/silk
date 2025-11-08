---
"@sylphx/silk-nextjs": patch
---

Add Next.js 16 support to peerDependencies

- Updated peerDependencies to include `^16.0.0`
- Fixes installation issues with Next.js 16.0.1
- v2.1.4 virtual module resolution was correct, issue was peer dependency conflict
