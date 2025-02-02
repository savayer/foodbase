import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const accessToken = cookies.get('access_token')?.value;

  const protectedRoutes = ['/profile'];
  const isAuthPage =
    nextUrl.pathname === '/login' || nextUrl.pathname === '/register';

  if (
    protectedRoutes.some((route) => nextUrl.pathname.startsWith(route)) &&
    !accessToken
  ) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // Covers all pages except APIs and static files
};
