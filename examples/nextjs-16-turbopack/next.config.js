/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Turbopack for development
  // turbo: {}, // Enabled by default in Next.js 16

  // SWC Plugin Configuration (uncomment after building WASM binary)
  // experimental: {
  //   swcPlugins: [
  //     [
  //       '../../packages/swc-plugin/target/wasm32-wasip1/release/swc_plugin_silk.wasm',
  //       {
  //         production: process.env.NODE_ENV === 'production',
  //         classPrefix: 'silk',
  //       }
  //     ]
  //   ]
  // },

  // Also use unplugin for CSS collection (hybrid approach)
  // webpack: (config) => {
  //   config.plugins.push(
  //     require('@sylphx/unplugin-silk').webpack({
  //       outputFile: 'public/silk.css',
  //     })
  //   )
  //   return config
  // },
}

module.exports = nextConfig
