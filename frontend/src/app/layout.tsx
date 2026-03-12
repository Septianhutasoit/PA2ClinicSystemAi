// src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import Chatbot from "@/components/Chatbot";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {/* Konten halaman (Landing Page atau Admin) akan muncul di sini */}
                {children}

                {/* Chatbot melayang di pojok kanan bawah */}
                <Chatbot />
            </body>
        </html>
    );
}