'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Menu, X, MessageCircle } from 'lucide-react';

const navLinks = [
    { label: 'About', href: '/patient/nauli-co/about' },
    { label: "Panduan Klinik", href: '/patient/nauli-co/panduan' },
    { label: 'Contact', href: '/patient/nauli-co/contact' },
];

export default function NauliCoLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);

    return (
        <div className="min-h-screen bg-white text-slate-800 selection:bg-emerald-100 selection:text-emerald-900">

            {/* ════════════════════════════════════════════════════
                NAVBAR MANDIRI — posisi top-0
                (Navbar hitam portal sudah di-bypass di PatientLayout)
            ════════════════════════════════════════════════════ */}
            <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300
            ${scrolled
                    ? 'h-16 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
                    : 'h-20 bg-transparent'}`}
            >
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

                    {/* ── Sisi Kiri ── */}
                    <div className="flex items-center gap-5">

                        {/* Tombol kembali ke portal — panah kiri */}
                        <Link href="/patient/dashboard"
                            className={`group flex items-center gap-2 transition-all hover:text-emerald-500
                            ${scrolled ? 'text-slate-400' : 'text-emerald-800/60'}`} // Ubah white/60 jadi emerald/60
                            title="Kembali ke Portal Utama"
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all
                             group-hover:border-emerald-400 group-hover:bg-emerald-500/20
                             ${scrolled ? 'border border-slate-200' : 'border border-emerald-200 bg-white/50'}`}>
                                <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.18em] hidden sm:block">
                                Kembali
                            </span>
                        </Link>

                        {/* Garis pemisah */}
                        <div className="w-px h-6 bg-slate-150" />

                        {/* Brand NauliCo */}
                        <Link href="/patient/nauli-co/about" className="flex items-center gap-3 group">
                            {/* Logo kotak hijau — mirip referensi Dentes Co */}
                            <div className="w-11 h-11 rounded-2xl bg-white border-2 border-emerald-400
                                shadow-md shadow-emerald-100 group-hover:border-emerald-500
                                group-hover:shadow-emerald-200 transition-all overflow-hidden
                                flex items-center justify-center p-1.5">
                                <img
                                    src="/images/Logo.png"
                                    alt="NauliCo"
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        const t = e.target as HTMLImageElement;
                                        t.style.display = 'none';
                                        if (t.parentElement)
                                            t.parentElement.innerHTML = '<span class="text-emerald-600 font-black text-base">N</span>';
                                    }}
                                />
                            </div>
                            {/* Teks */}
                            <div className="flex flex-col leading-none">
                                <span className={`font-black text-[18px] tracking-tighter uppercase transition-colors duration-300
                                    ${scrolled ? 'text-slate-900' : 'text-[#005A32]'}`}> {/* Gunakan Hijau Tua */}
                                    Nauli<span className="text-emerald-500">Dental</span>
                                </span>
                                <span className={`text-[8px] font-black uppercase tracking-[0.22em] mt-0.5 transition-colors duration-300
                                     ${scrolled ? 'text-slate-300' : 'text-emerald-700/50'}`}>
                                    Balige
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-0.5">
                        {navLinks.map(link => {
                            const isActive = pathname === link.href;
                            return (
                                <Link key={link.href} href={link.href}
                                    className={`relative px-5 py-2 text-[11px] font-black uppercase tracking-widest transition-all duration-200
                    ${isActive
                                            ? scrolled ? 'text-emerald-600' : 'text-emerald-500'
                                            : scrolled ? 'text-slate-400 hover:text-slate-800' : 'text-[#005A32]/60 hover:text-[#005A32]'}`} // Ubah white/70 jadi emerald gelap
                                >
                                    {link.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="naulicoUnderline"
                                            className="absolute bottom-0 left-4 right-4 h-0.5 bg-emerald-500 rounded-full"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* ── Mobile Toggle ── */}
                    <button onClick={() => setMobileOpen(v => !v)}
                        className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-all">
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Mobile dropdown */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
                        >
                            <div className="px-4 py-3 space-y-1">
                                {navLinks.map(link => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all
                                                ${isActive ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-800'}`}>
                                            {link.label}
                                            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                        </Link>
                                    );
                                })}
                                {/* Back to portal in mobile */}
                                <Link href="/patient/dashboard" onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-300 hover:bg-slate-50 hover:text-slate-600 transition-all border-t border-slate-100 mt-2 pt-4">
                                    <ChevronLeft size={14} /> Kembali ke Portal
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* ── Konten halaman ── */}
            <main className="pt-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* ════════════════════════════════════════════════════
                FLOATING WHATSAPP KANAN BAWAH
                (Need Help? Chat with us — sesuai referensi)
            ════════════════════════════════════════════════════ */}
            <div className="fixed bottom-8 right-8 z-[110] flex flex-col items-end gap-2">
                {/* Tooltip */}
                <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="bg-white border border-slate-100 shadow-lg rounded-2xl px-4 py-2.5 mr-1"
                >
                    <p className="text-[10px] font-black text-slate-600 whitespace-nowrap">
                        Need Help? <span className="text-green-600">Chat with us</span>
                    </p>
                </motion.div>

                {/* WA Button */}
                <Link href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.92 }}
                        className="w-16 h-16 rounded-full bg-[#25D366] flex items-center justify-center
                            shadow-2xl shadow-green-300/50 cursor-pointer border-4 border-white"
                    >
                        <MessageCircle size={30} className="text-white fill-white" />
                    </motion.div>
                </Link>
            </div>
        </div>
    );
}