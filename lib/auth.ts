import { NextRequest } from 'next/server'

export const SESSION_COOKIE = 'billing_session'

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function tokenForPassword(password: string): Promise<string> {
  return sha256Hex(password)
}

export async function isAuthed(req: NextRequest): Promise<boolean> {
  const password = process.env.APP_PASSWORD
  if (!password) return true // no password configured: open access (local dev)
  const expected = await sha256Hex(password)
  const cookie = req.cookies.get(SESSION_COOKIE)?.value
  return cookie === expected
}
