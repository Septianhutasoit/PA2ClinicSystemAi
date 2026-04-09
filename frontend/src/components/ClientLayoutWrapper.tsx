'use client';
import { usePathname } from "next/navigation";
import Chatbot from "@/components/Chatbot";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Logika deteksi halaman
    const isAdminPath = pathname.startsWith('/admin') || pathname.startsWith('/dashboard') || pathname.startsWith('/patient');
    const isAuthPath = pathname.startsWith('/login') ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/forgot-password');

    return (
        <>
            {/* HAPUS UserNavbar - Tidak digunakan lagi */}
            {/* {!isAdminPath && !isAuthPath && <UserNavbar />} */}

            {/* Konten Halaman */}
            <main>{children}</main>

            {/* Tampilkan Chatbot jika bukan halaman Admin */}
            {!isAdminPath && <Chatbot />}
        </>
    );
}