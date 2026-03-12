import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value; // Kita akan simpan token di cookie agar aman
    const { pathname } = request.nextUrl;

    // Jika mencoba masuk ke dashboard tanpa token, lempar ke halaman login
    if (pathname.startsWith('/dashboard') && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/dashboard/:path*', // Proteksi semua yang ada di dalam folder dashboard
};