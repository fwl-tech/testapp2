import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'agens field — An AI company creation platform',
  description: 'We ideate, build, fund, and launch AI-native companies ourselves.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
