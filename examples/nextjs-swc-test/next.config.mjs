import { withSilk } from '@sylphx/silk-nextjs'

export default withSilk({
  // Next.js config
}, {
  // Silk config
  outputFile: 'silk.css',
  inject: true,
  babelOptions: {
    production: false,
    classPrefix: 'test',
  }
})
