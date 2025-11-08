import { createStyleSystem } from '@sylphx/silk'

const { css } = createStyleSystem({})

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f0f0'
  } as any),

  title: css({
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#673ab8',
    marginBottom: '1.5rem'
  } as any),

  subtitle: css({
    fontSize: '1.25rem',
    color: '#666',
    marginBottom: '2rem'
  } as any),

  card: css({
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  } as any)
}

export function App() {
  return (
    <div className={styles.container.className}>
      <h1 className={styles.title.className}>Preact + Silk ✅</h1>
      <p className={styles.subtitle.className}>Fast 3kB alternative to React</p>
      <div className={styles.card.className}>
        <p>Zero-codegen CSS-in-TypeScript working with Preact!</p>
      </div>
    </div>
  )
}
