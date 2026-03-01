import { NextResponse } from 'next/server';
// import { requireFounder } from "@maatwork/auth/middleware"; // Assuming this comes from your UI/Auth packages

export async function middleware() {
  // For the scaffold, pass through successfully
  // return requireFounder(req);
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
