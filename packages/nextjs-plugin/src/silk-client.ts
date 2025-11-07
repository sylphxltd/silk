/**
 * Client-side runtime for Silk + Next.js
 * Handles CSS injection and HMR
 */

if (typeof window !== 'undefined') {
  // Inject Silk CSS if not already present
  const existingStyle = document.querySelector('style[data-silk]')

  if (!existingStyle) {
    const style = document.createElement('style')
    style.setAttribute('data-silk', '')
    document.head.appendChild(style)
  }

  // HMR support
  // @ts-expect-error - module.hot is from webpack
  if (module.hot) {
    // @ts-expect-error - module.hot is from webpack
    module.hot.accept()
  }
}
