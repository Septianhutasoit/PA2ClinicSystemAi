import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const role = request.cookies.get('role')?.value;
    const { pathname } = request.nextUrl;

    // ✅ KRITIS #4: Proteksi rute /admin — hanya admin
    if (pathname.startsWith('/admin')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        if (role?.toLowerCase() !== 'admin') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // ✅ KRITIS #4: Proteksi rute /nurse — hanya nurse
    if (pathname.startsWith('/nurse')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        if (role?.toLowerCase() !== 'nurse') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // ✅ Proteksi rute /patient — harus login
    if (pathname.startsWith('/patient')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Proteksi rute /dashboard (sudah ada sebelumnya)
    if (pathname.startsWith('/dashboard') && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    // ✅ Matcher diperluas ke semua rute yang perlu dilindungi
    matcher: [
        '/admin/:path*',
        '/nurse/:path*',
        '/patient/:path*',
        '/dashboard/:path*',
    ],
};