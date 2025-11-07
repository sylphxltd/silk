'use client'

// TODO: Import Silk after plugin is set up
// import { css } from '@sylphx/silk'

export default function Home() {
  // Test styles (will be uncommented after SWC plugin is working)
  // const button = css({
  //   bg: 'blue',
  //   color: 'white',
  //   p: 4,
  //   rounded: 8,
  //   fontSize: 16,
  //   fontWeight: 'bold',
  //   _hover: {
  //     bg: 'darkblue',
  //   },
  // })

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 'bold',
        marginBottom: '2rem',
      }}>
        Next.js 16 + Turbopack + Silk
      </h1>

      <p style={{
        fontSize: '1.2rem',
        marginBottom: '2rem',
        textAlign: 'center',
        maxWidth: '600px',
      }}>
        This is a test project for <code>@sylphx/swc-plugin-silk</code> with Next.js 16 and Turbopack enabled.
      </p>

      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        <button
          // className={button}
          style={{
            backgroundColor: 'blue',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Test Button (Inline Styles)
        </button>

        <button
          style={{
            backgroundColor: 'green',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Another Button
        </button>
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        maxWidth: '600px',
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          Setup Instructions
        </h2>
        <ol style={{ paddingLeft: '1.5rem' }}>
          <li>Build the SWC plugin WASM binary</li>
          <li>Install Silk packages</li>
          <li>Configure next.config.js with swcPlugins</li>
          <li>Uncomment the Silk imports and styles above</li>
          <li>Run with Turbopack enabled</li>
        </ol>
      </div>
    </main>
  )
}
