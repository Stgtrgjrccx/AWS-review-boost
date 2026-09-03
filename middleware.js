import { NextResponse } from 'next/server'

export function middleware(req) {
  // Public routes: /live, /review, /api/public, /login
  const { pathname } = req.nextUrl
  
  // Allow all traffic seamlessly for the operator and public client portals
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
