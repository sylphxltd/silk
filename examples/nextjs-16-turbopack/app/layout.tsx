import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Next.js 16 + Turbopack + Silk Test',
  description: 'Testing @sylphx/swc-plugin-silk with Next.js 16 and Turbopack',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
