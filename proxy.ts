import { NextRequest, NextResponse } from 'next/server'
import { isAuthed } from './lib/auth'

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isPublic =
    pathname.endsWith('/health') ||
    pathname.endsWith('/login') ||
    pathname.endsWith('/api/login') ||
    pathname.endsWith('/api/agent/cron')

  if (isPublic || (await isAuthed(req))) {
    return NextResponse.next()
  }

  const loginUrl = req.nextUrl.clone()
  loginUrl.pathname = '/login'
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/', '/((?!_next/static|_next/image|favicon.ico).*)'],
}
