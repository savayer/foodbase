import { NextResponse, NextRequest } from 'next/server';
import { setCookie } from 'cookies-next';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cookiesStore = await cookies();
  const accessToken = searchParams.get('access_token');
  const user = searchParams.get('user');

  if (!accessToken || !user) {
    return NextResponse.json(
      { error: 'Invalid request: missing access_token or user' },
      { status: 400 },
    );
  }

  try {
    cookiesStore.set('access_token', accessToken, {
      maxAge: 60 * 60 * 24 * 30,
    });
    cookiesStore.set('user', user, {
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.redirect(new URL('/', req.url));
  } catch (error) {
    console.error('Error during Google callback:', error);

    return NextResponse.redirect(new URL('/error', req.url));
  }
}
