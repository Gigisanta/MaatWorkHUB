import { auth } from "./index";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function requireFounder(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'founder') {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}

export async function requireTenantAccess(req: NextRequest, tenantSlug: string) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  if (session.user.role === 'founder') {
    return NextResponse.next(); // Founders can access any tenant
  }
  
  // Future lookup logic to match tenantSlug to tenantId
  // For now, allow if tenantId exists on user
  if (!session.user.tenantId) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }
  
  return NextResponse.next();
}
