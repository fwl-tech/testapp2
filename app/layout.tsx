import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Billing Agent — testapp2',
  description: 'AI billing & invoicing assistant',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
