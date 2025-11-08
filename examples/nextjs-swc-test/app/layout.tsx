import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Silk SWC Plugin Test',
  description: 'Testing SWC plugin with Next.js 16 + Turbopack',
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
