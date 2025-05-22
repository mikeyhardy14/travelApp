import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  const path = url.pathname;
  
  // Handle app subdomain routes
  if (hostname.startsWith('app.')) {
    // If we're at the root of app subdomain, redirect to dashboard
    if (path === '/' || path === '') {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    
    // Remove the /app prefix from paths if present
    if (path.startsWith('/app/')) {
      url.pathname = path.replace('/app', '');
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
} 