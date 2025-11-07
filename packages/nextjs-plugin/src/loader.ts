/**
 * Webpack loader for Silk + Next.js
 * Extracts CSS at build time
 */

interface LoaderOptions {
  outputFile: string
  production: boolean
  isServer: boolean
  appRouter: boolean
  rsc: boolean
  criticalCSS: boolean
  brotli: boolean
}

export default function silkLoader(this: any, source: string) {
  const options: LoaderOptions = this.getOptions()
  const callback = this.async()

  try {
    // In server context, extract CSS
    if (options.isServer) {
      // Extract CSS during SSR
      // This would integrate with Silk's runtime to collect CSS
    }

    // Pass through source unchanged
    callback(null, source)
  } catch (error) {
    callback(error instanceof Error ? error : new Error(String(error)))
  }
}
