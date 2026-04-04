'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';  
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, CalendarDays, ClipboardList,
    Bell, ChevronDown, LogOut, Settings, User, Sparkles
} from 'lucide-react';

export default function PatientLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // 1. PROTEKSI ROLE PASIEN
    useEffect(() => {
        const token = localStorage.getItem('token') || Cookies.get('token');
        const role = localStorage.getItem('user_role') || Cookies.get('role');

        if (!token || role?.toLowerCase() !== 'patient') {
            router.push('/login');
        } else {
            setIsAuthorized(true);
        }
    }, [router, pathname]);

    const handleLogout = () => {
        if (confirm("Keluar dari Portal Pasien?")) {
            localStorage.clear();
            Cookies.remove('token');
            Cookies.remove('role');
            window.location.href = '/';
        }
    };

    const navItems = [
        { name: 'Dashboard', href: '/patient/dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'Janji Temu', href: '/patient/appointments', icon: <CalendarDays size={18} /> },
        { name: 'Rekam Medis', href: '/patient/records', icon: <ClipboardList size={18} /> },
    ];

    if (!isAuthorized) return null;

    return (
        <div className="min-h-screen bg-[#F8F9FD] font-sans">

            {/* --- MODERN TOP NAVBAR --- */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6">
                <div className="max-w-7xl mx-auto h-16 flex justify-between items-center">

                    {/* Brand Section */}
                    <Link href="/patient/dashboard" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black italic shadow-lg shadow-indigo-100 group-hover:rotate-6 transition-transform">K</div>
                        <span className="text-xl font-black tracking-tighter text-slate-800">Nauli<span className="text-indigo-600">Portal</span></span>
                    </Link>

                    {/* Nav Links - Desktop */}
                    <div className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href} className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 ${isActive ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    }`}>
                                    {item.icon}
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Action Section */}
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full relative transition-all">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        <div className="h-8 w-[1px] bg-slate-100 mx-1" />

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 p-1 pl-3 bg-slate-50 border border-slate-100 rounded-full hover:border-indigo-200 transition-all"
                            >
                                <div className="text-right hidden sm:block leading-none">
                                    <p className="text-[10px] font-black text-slate-900 uppercase">Septian Pasien</p>
                                    <p className="text-[9px] text-indigo-600 font-bold mt-0.5">MEMBER GOLD</p>
                                </div>
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Septian" className="w-8 h-8 rounded-full bg-indigo-100 border border-white" alt="avatar" />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-3 w-56 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 py-2 overflow-hidden"
                                    >
                                        <div className="px-4 py-3 border-b border-slate-50 mb-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status Akun</p>
                                            <p className="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1">
                                                <Sparkles size={14} className="text-amber-500" /> Aktif & Terverifikasi
                                            </p>
                                        </div>
                                        <button className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors"><User size={16} className="text-slate-300" /> My Profile</button>
                                        <button className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors"><Settings size={16} className="text-slate-300" /> Settings</button>
                                        <div className="h-[1px] bg-slate-50 my-1 mx-2" />
                                        <button onClick={handleLogout} className="w-full px-4 py-2.5 text-left text-xs font-black text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
                                            <LogOut size={16} /> Keluar Portal
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- AREA KONTEN (PAGES) --- */}
            <main className="pt-24 pb-12 px-6 lg:px-10 max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Backdrop click outside */}
            {isProfileOpen && <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>}
        </div>
    );
}