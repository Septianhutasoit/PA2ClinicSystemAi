import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const role = request.cookies.get('role')?.value?.toLowerCase();
    const { pathname } = request.nextUrl;

    // 1. Jika sudah login dan mencoba akses /login atau /register, redirect ke dashboard masing-masing
    if (token && (pathname === '/login' || pathname === '/register')) {
        if (role === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
        if (role === 'doctor') return NextResponse.redirect(new URL('/doctor', request.url));
        if (role === 'nurse') return NextResponse.redirect(new URL('/nurse', request.url));
        if (role === 'patient') return NextResponse.redirect(new URL('/patient/dashboard', request.url));
    }

    // 2. Proteksi /admin — hanya role admin
    if (pathname.startsWith('/admin')) {
        if (!token || role !== 'admin') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // 3. Proteksi /doctor — hanya role doctor
    if (pathname.startsWith('/doctor')) {
        if (!token || role !== 'doctor') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // 4. Proteksi /nurse — hanya role nurse
    if (pathname.startsWith('/nurse')) {
        if (!token || role !== 'nurse') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // 5. Proteksi /patient — Izinkan halaman publik untuk tamu (GUEST MODE)
    if (pathname.startsWith('/patient')) {
        const publicPatientPages = [
            '/patient/dashboard',
            '/patient/services',
            '/patient/about',
            '/patient/doctors',
            '/patient/visiMisi',
        ];

        // Jika TIDAK ADA TOKEN dan halaman yang diakses BUKAN halaman publik
        if (!token && !publicPatientPages.includes(pathname)) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Izinkan akses jika semua pengecekan di atas lolos
    return NextResponse.next();
}

// Konfigurasi matcher untuk menentukan URL mana saja yang diproses middleware
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