import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';
  
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_next') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  // Extract tenant slug from subdomain
  const currentHost =
    process.env.NODE_ENV === 'production'
      ? hostname.replace(`.maat.work`, '')
      : hostname.replace(`.localhost:3000`, '');
      
  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;

  if (currentHost && currentHost !== 'localhost:3000' && currentHost !== 'maat.work') {
    return NextResponse.rewrite(new URL(`/${currentHost}${path}`, req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
