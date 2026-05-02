import "./globals.css";
import { Inter } from "next/font/google";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper"; // Kita buat ini di langkah 2

const inter = Inter({ subsets: ["latin"] });

// METADATA DITARUH DI SINI (Di luar fungsi & di Server Component)
export const metadata = {
    title: "Klinik.AI | Sistem Informasi Klinik Gigi",
    description: "Sistem Klinik Gigi Modern Terintegrasi AI",
    icons: {
        icon: "/iconn.png", 
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={`${inter.className} antialiased bg-white selection:bg-blue-100 text-slate-900`}>
                {/* Panggil Wrapper untuk mengurusi logika Navbar & Chatbot */}
                <ClientLayoutWrapper>
                    {children}
                </ClientLayoutWrapper>
            </body>
        </html>
    );
}