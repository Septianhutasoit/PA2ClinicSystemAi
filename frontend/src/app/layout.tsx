'use client';
import "./globals.css";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import Chatbot from "@/components/Chatbot";
import UserNavbar from "@/components/UserNavbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Deteksi halaman untuk menyembunyikan navbar/chatbot pasien
    const isAdminPath = pathname.startsWith('/admin') || pathname.startsWith('/dashboard');
    const isAuthPath = pathname.startsWith('/login') ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/forgot-password');

    return (
        <html lang="en" className="scroll-smooth">
            <body className={`${inter.className} antialiased bg-white selection:bg-blue-100 text-slate-900`}>

                {/* NAVBAR PASIEN: Hanya muncul jika bukan halaman Admin & bukan Login/Register */}
                {!isAdminPath && !isAuthPath && <UserNavbar />}

                {/* KONTEN UTAMA: Muncul di semua halaman */}
                <main>{children}</main>

                {/* CHATBOT: Muncul hanya untuk Pasien (Jangan di Admin agar tidak menutupi tabel) */}
                {!isAdminPath && <Chatbot />}

            </body>
        </html>
    );
}