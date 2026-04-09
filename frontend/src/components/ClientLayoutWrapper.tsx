'use client';
import { usePathname } from "next/navigation";
import Chatbot from "@/components/Chatbot";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // 1. Tentukan halaman mana saja yang dianggap "Sisi Pasien/User"
    // Chatbot hanya akan muncul jika user berada di Beranda (/) atau folder /patient
    const isUserPage = pathname === '/' || pathname.startsWith('/patient');

    // 2. Tentukan halaman Auth (Login/Register) untuk jaga-jaga
    const isAuthPath = pathname.startsWith('/login') ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/forgot-password');

    return (
        <>
            {/* Konten Halaman Utama (Admin, Pasien, atau Login) */}
            <main>{children}</main>

            {/* 3. TAMPILKAN CHATBOT HANYA UNTUK USER/PASIEN */}
            {/* Kita hilangkan kemunculannya di Admin dan di halaman Login/Register */}
            {isUserPage && !isAuthPath && <Chatbot />}
        </>
    );
}