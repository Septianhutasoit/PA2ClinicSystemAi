import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const role  = request.cookies.get('role')?.value?.toLowerCase();
    const { pathname } = request.nextUrl;

    // Jika sudah login dan mencoba akses /login atau /register, redirect ke dashboard
    if (token && (pathname === '/login' || pathname === '/register')) {
        if (role === 'admin')   return NextResponse.redirect(new URL('/admin', request.url));
        if (role === 'doctor')  return NextResponse.redirect(new URL('/doctor', request.url));
        if (role === 'nurse')   return NextResponse.redirect(new URL('/nurse', request.url));
        if (role === 'patient') return NextResponse.redirect(new URL('/patient/dashboard', request.url));
    }

    // Proteksi /admin — hanya role admin
    if (pathname.startsWith('/admin')) {
        if (!token || role !== 'admin') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Proteksi /doctor — hanya role doctor
    if (pathname.startsWith('/doctor')) {
        if (!token || role !== 'doctor') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Proteksi /nurse — hanya role nurse
    if (pathname.startsWith('/nurse')) {
        if (!token || role !== 'nurse') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Proteksi /patient — harus login (role apa saja)
    if (pathname.startsWith('/patient')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/login',
        '/register',
        '/admin/:path*',
        '/doctor/:path*',
        '/nurse/:path*',
        '/patient/:path*',
    ],
};