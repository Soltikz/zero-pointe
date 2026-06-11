import { NextRequest, NextResponse } from 'next/server'

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // On ne touche pas aux routes techniques
  if (
    pathname.startsWith('/welcome') ||
    pathname.startsWith('/confidentialite') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Si le cookie n'existe pas → première visite → on redirige
  const cookie = request.cookies.get('zero-pointe-visited')
  if (!cookie) {
    return NextResponse.redirect(new URL('/welcome', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}