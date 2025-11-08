'use client'

import { css } from '@sylphx/silk'

const container = css({
  p: 8,
  bg: '#f0f0f0',
  rounded: '12px',
  maxW: '800px',
  mx: 'auto',
  mt: 16,
})

const title = css({
  fontSize: '36px',
  fontWeight: 'bold',
  color: '#333',
  mb: 4,
})

const card = css({
  bg: 'white',
  p: 6,
  rounded: '8px',
  shadow: '0 2px 8px rgba(0,0,0,0.1)',
  mb: 4,
})

const button = css({
  bg: 'blue',
  color: 'white',
  px: 6,
  py: 3,
  rounded: '6px',
  fontSize: '16px',
  fontWeight: '500',
  cursor: 'pointer',
  border: 'none',
  _hover: {
    opacity: 0.9,
  },
})

export default function Home() {
  return (
    <div className={container}>
      <h1 className={title}>Silk SWC Plugin Test</h1>

      <div className={card}>
        <h2>Testing Automatic CSS Injection</h2>
        <p>If you see this styled correctly, Silk is working!</p>
      </div>

      <div className={card}>
        <h3>Features Tested:</h3>
        <ul>
          <li>✅ Zero-runtime CSS extraction</li>
          <li>✅ Atomic class generation</li>
          <li>✅ Automatic CSS injection</li>
          <li>✅ TypeScript support</li>
        </ul>
      </div>

      <button className={button} onClick={() => alert('Silk works!')}>
        Test Button
      </button>
    </div>
  )
}
