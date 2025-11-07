import { css } from '@sylphx/silk'
import { useState } from 'react'

// Test 1: Simple static styles (transformed at build-time)
const button = css({
  bg: 'blue',
  color: 'white',
  p: 4,
  rounded: 8,
  cursor: 'pointer',
  border: 'none',
  fontSize: '16px',
})

// Test 2: Pseudo-selector
const hoverButton = css({
  bg: 'red',
  color: 'white',
  p: 3,
  rounded: 8,
  cursor: 'pointer',
  border: 'none',
  fontSize: '16px',
  _hover: {
    bg: 'darkred',
    transform: 'scale(1.05)',
  },
})

// Test 3: Multiple properties
const card = css({
  bg: 'white',
  p: 6,
  rounded: 12,
  w: 300,
  shadow: 'md',
  border: '1px solid #e0e0e0',
})

// Test 4: Responsive styles (for future testing)
const container = css({
  maxW: '1200px',
  mx: 'auto',
  p: 4,
})

// Test 5: Focus state
const input = css({
  p: 2,
  rounded: 4,
  border: '2px solid #ccc',
  fontSize: '14px',
  _focus: {
    borderColor: 'blue',
    outline: 'none',
  },
})

function App() {
  const [count, setCount] = useState(0)
  const [inputValue, setInputValue] = useState('')

  return (
    <div className={container}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 'bold' }}>
        🎨 Silk Zero-Runtime Test
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Interactive Counter Test */}
        <div className={card}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Counter Test (HMR)</h3>
          <p style={{ marginBottom: '1rem' }}>Count: {count}</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className={button} onClick={() => setCount(count + 1)}>
              Increment
            </button>
            <button className={hoverButton} onClick={() => setCount(0)}>
              Reset
            </button>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
            Try editing styles above and save - HMR should preserve state!
          </p>
        </div>

        {/* Input Test */}
        <div className={card}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Input Focus Test</h3>
          <input
            className={input}
            type="text"
            placeholder="Click to focus"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            {inputValue ? `You typed: ${inputValue}` : 'Type something...'}
          </p>
        </div>

        {/* Style Examples */}
        <div className={card}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Button Examples</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button className={button}>Primary Button</button>
            <button className={hoverButton}>Hover Effect</button>
          </div>
        </div>

        {/* Build Info */}
        <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>✅ Zero-Runtime Status</h3>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            <li>✅ CSS compiled at build-time</li>
            <li>✅ Atomic class names generated</li>
            <li>✅ CSS extracted to silk.css</li>
            <li>✅ Zero runtime overhead (no CSS-in-JS at runtime)</li>
            <li>✅ HMR preserves component state</li>
          </ul>
          <details style={{ marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              🔍 How to verify
            </summary>
            <ol style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
              <li>Open DevTools and inspect button element</li>
              <li>Look for class names like "silk_bg_blue_xxxx silk_p_4_xxxx"</li>
              <li>Check Network tab for silk.css file</li>
              <li>Edit button styles above and save to test HMR</li>
              <li>Verify counter state is preserved after HMR</li>
            </ol>
          </details>
        </div>
      </div>
    </div>
  )
}

export default App
