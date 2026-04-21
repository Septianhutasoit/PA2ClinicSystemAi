'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import {
    LayoutDashboard,
    CalendarCheck2,
    Users2,
    LogOut,
    Menu,
    X,
    Loader2,
    Stethoscope,
    ClipboardList
} from 'lucide-react';

export default function NurseLayout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // PROTEKSI RUTE: Hanya role 'nurse' yang bisa masuk
    useEffect(() => {
        const token = localStorage.getItem('token') || Cookies.get('token');
        const role = localStorage.getItem('user_role') || Cookies.get('role');

        if (!token) {
            router.push('/login');
        } else if (role?.toLowerCase() !== 'nurse') {
            alert('⛔ Akses ditolak: Area ini khusus untuk Perawat');
            router.push('/login');
        } else {
            setIsAuthorized(true);
        }
    }, [router]); // Auth dicek sekali saat mount saja

    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user_role');
            Cookies.remove('token');
            Cookies.remove('role');
            router.push('/login');
        }
    };

    const navItems = [
        { name: 'Dashboard', href: '/nurse', icon: <LayoutDashboard size={16} />, color: 'text-teal-600', bg: 'bg-teal-50' },
        { name: 'Reservasi Hari Ini', href: '/nurse/appointments', icon: <CalendarCheck2 size={16} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { name: 'Daftar Pasien', href: '/nurse/patients', icon: <Users2 size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { name: 'Layanan Klinik', href: '/nurse/services', icon: <Stethoscope size={16} />, color: 'text-cyan-600', bg: 'bg-cyan-50' },
        { name: 'Catatan Medis', href: '/nurse/records', icon: <ClipboardList size={16} />, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];

    // Loading screen saat verifikasi role
    if (!isAuthorized) {
        return (
            <div className="h-screen w-screen bg-white flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-teal-600" size={40} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Memverifikasi Akses Perawat...</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#F4F7FE] text-[#1E293B] font-sans">

            {/* SIDEBAR */}
            <aside className={`fixed lg:sticky lg:top-0 z-50 w-60 h-screen bg-white border-r border-teal-50/50 shadow-sm transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-5 flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-teal-200 font-black italic text-xs">K</div>
                        <h1 className="text-base font-black tracking-tighter text-slate-800">Klinik.<span className="text-teal-600">AI</span></h1>
                    </div>

                    {/* Badge Role */}
                    <div className="mx-3 mb-4 p-3 bg-teal-50/40 rounded-xl border border-teal-100/50">
                        <p className="text-[10px] font-black text-teal-900 uppercase leading-none">Nauli Dental Care</p>
                        <p className="text-[9px] text-teal-500 font-bold truncate mt-1 italic opacity-70">Panel Perawat</p>
                    </div>

                    {/* Navigasi */}
                    <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-3 mb-2 opacity-60">Nurse System</p>
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href} className="block group">
                                    <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all relative ${isActive ? 'bg-teal-600 text-white shadow-md shadow-teal-200' : 'text-slate-600 hover:bg-teal-50/50 hover:text-teal-600'}`}>
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${isActive ? 'bg-white/20' : 'bg-transparent'}`}>
                                            <span className={isActive ? 'text-white' : item.color}>{item.icon}</span>
                                        </div>
                                        <span className={`text-[12px] font-bold tracking-tight ${isActive ? 'text-white' : ''}`}>{item.name}</span>
                                        {isActive && <motion.div layoutId="nurse-nav-line" className="absolute -left-1 w-1 h-4 bg-teal-600 rounded-full" />}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-3 border-t border-slate-100">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-700 hover:bg-red-50 text-[13px] font-medium transition-colors group rounded-xl"
                        >
                            <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                            <span className="font-bold">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
                <header className="h-14 bg-white/80 backdrop-blur-md border-b border-teal-50/50 px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 bg-teal-50 rounded-lg text-teal-600">
                            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                        <h2 className="text-[12px] font-black text-slate-800 tracking-widest leading-none uppercase italic border-l-2 border-teal-600 pl-3">
                            {navItems.find(i => i.href === pathname)?.name || 'Nurse Panel'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-teal-600 uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full">Perawat</span>
                    </div>
                </header>

                <div className="flex-1 p-6 lg:p-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="max-w-[1500px] mx-auto"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {isMobileMenuOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
        </div>
    );
}
