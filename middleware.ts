import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Get the path
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/auth/login' || 
                      path === '/auth/signup' || 
                      path === '/auth/reset-password';
  
  // Get session cookie
  const sessionCookie = request.cookies.get('session')?.value || '';
  
  // If it's a protected path and no session exists, redirect to login
  if (!isPublicPath && !sessionCookie) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // If user is already logged in and tries to access login/signup pages
  if (isPublicPath && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Only run middleware on these paths
export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};