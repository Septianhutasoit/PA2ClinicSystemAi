'use client';
import "./globals.css";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import Chatbot from "@/components/Chatbot";
import UserNavbar from "@/components/UserNavbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Deteksi halaman
    const isAdminPage = pathname.startsWith('/admin');
    const isDashboardPage = pathname.startsWith('/dashboard'); // Jika masih dipakai
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

    return (
        <html lang="en" className="scroll-smooth">
            <body className={`${inter.className} antialiased selection:bg-blue-100`}>

                {/* NAVBAR: Hanya untuk Pasien (Bukan Admin/Login) */}
                {!isAdminPage && !isDashboardPage && !isAuthPage && <UserNavbar />}

                {/* KONTEN: page.tsx (User) atau admin/page.tsx */}
                <main>{children}</main>

                {/* CHATBOT: Hanya untuk Pasien */}
                {!isAdminPage && !isDashboardPage && <Chatbot />}

            </body>
        </html>
    );
}