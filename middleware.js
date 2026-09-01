import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // If logged in but onboarding not done, redirect to onboarding
    if (
      token &&
      pathname.startsWith('/dashboard') &&
      token.business &&
      !token.business.onboardingDone
    ) {
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }

    // If logged in but no business yet, redirect to onboarding
    if (token && pathname.startsWith('/dashboard') && !token.business) {
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        // Protect dashboard and onboarding routes
        if (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding')) {
          return !!token
        }
        return true
      },
    },
    pages: {
      signIn: '/login',
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*'],
}
