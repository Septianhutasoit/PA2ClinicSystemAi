'use client';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import api from '@/services/api';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import ConfirmModal from '@/components/ConfirmModal';
import {
    LayoutDashboard, Users2, UserRoundCog, CalendarCheck2,
    BellRing, BrainCircuit, Stethoscope, Search, LogOut,
    Database, Menu, X, Settings2, AlarmClockCheck, Loader2,
    ChevronRight, Sparkles, UserCircle, Shield, Lock // Ikon tambahan
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const pathname = usePathname();
    const router = useRouter();

    // 1. PROTEKSI RUTE & SESI
    useEffect(() => {
        const token = localStorage.getItem('token') || Cookies.get('token');
        const role = localStorage.getItem('user_role') || Cookies.get('role');

        if (!token) {
            router.push('/login');
        } else if (role?.toLowerCase() !== 'admin') {
            alert("Akses Terbatas untuk Admin!");
            router.push('/');
        } else {
            setIsAuthorized(true);
        }
    }, [pathname, router]);

    // 2. CLOSE DROPDOWN WHEN CLICKING OUTSIDE
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 3. FUNGSI LOGOUT TOTAL (Pembersihan Sesi)
    const handleLogout = () => {
        localStorage.clear();
        Cookies.remove('token');
        Cookies.remove('role');
        window.location.href = '/login';
    };

    const handleSyncAI = async () => {
        const confirmSync = confirm("Sinkronisasi database AI?");
        if (!confirmSync) return;
        setIsSyncing(true);
        try {
            await api.post('/chatbot/ingest');
            alert("✅ AI Knowledge Updated!");
        } catch (err) { alert("❌ Sync Failed"); }
        finally { setIsSyncing(false); }
    };

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { name: 'Reservations', href: '/admin/appointments', icon: <CalendarCheck2 size={16} />, color: 'text-teal-600', bg: 'bg-teal-50' },
        { name: 'Daftar Pasien', href: '/admin/patients', icon: <Users2 size={16} />, color: 'text-green-600', bg: 'bg-green-50' },
        { name: 'Manajemen Dokter', href: '/admin/doctors', icon: <UserRoundCog size={16} />, color: 'text-cyan-600', bg: 'bg-cyan-50' },
        { name: 'Manajemen Jadwal', href: '/admin/schedules', icon: <AlarmClockCheck size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { name: 'AI Knowledge', href: '/admin/knowledge', icon: <BrainCircuit size={16} />, color: 'text-teal-600', bg: 'bg-teal-50' },
        { name: 'Layanan Klinik', href: '/admin/services', icon: <Stethoscope size={16} />, color: 'text-green-600', bg: 'bg-green-50' },
        { name: 'Pengaturan', href: '/admin/settings', icon: <Settings2 size={16} />, color: 'text-slate-600', bg: 'bg-slate-100' },
    ];

    const profileMenuItems = [
        { name: 'View Profile', icon: <UserCircle size={16} />, action: () => { setIsProfileOpen(false); router.push('/admin/profile'); } },
        { name: 'Change Account', icon: <Shield size={16} />, action: () => { setIsProfileOpen(false); router.push('/admin/change-account'); } },
        { name: 'Sign Out', icon: <LogOut size={16} />, action: handleLogout, color: 'text-red-600' },
    ];

    if (!isAuthorized) return (
        <div className="h-screen w-screen bg-white flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-emerald-600" size={32} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Checking Security...</p>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[#F0F9F7] text-[#1E293B] font-sans">

            {/* --- SIDEBAR (HIJAU TUAT) --- */}
            <aside className={`fixed lg:sticky lg:top-0 z-50 w-60 h-screen bg-white border-r border-emerald-50/50 shadow-sm transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo - Hijau Tua */}
                    <div className="p-5 flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-emerald-700 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-200 font-black italic text-xs">K</div>
                        <h1 className="text-base font-black tracking-tighter text-slate-800">Klinik.<span className="text-emerald-700">AI</span></h1>
                    </div>

                    {/* Alamat - Hijau Tua */}
                    <div className="mx-3 mb-4 p-3 bg-emerald-50/40 rounded-xl border border-emerald-100/50">
                        <p className="text-[10px] font-black text-emerald-900 uppercase leading-none">Nauli Dental Care</p>
                        <p className="text-[9px] text-emerald-600 font-bold truncate mt-1 italic opacity-70">Jl. Balige No. 12, Toba</p>
                    </div>

                    {/* Navigasi */}
                    <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-3 mb-2 opacity-60">Admin System</p>
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href} className="block group">
                                    <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all relative ${isActive ? "bg-emerald-700 text-white shadow-md shadow-emerald-200" : "text-slate-600 hover:bg-emerald-50/50 hover:text-emerald-700"}`}>
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${isActive ? "bg-white/20" : "bg-transparent"}`}>
                                            <span className={isActive ? "text-white" : item.color}>{item.icon}</span>
                                        </div>
                                        <span className={`text-[12px] font-bold tracking-tight ${isActive ? "text-white" : ""}`}>{item.name}</span>
                                        {isActive && <motion.div layoutId="nav-line" className="absolute -left-1 w-1 h-4 bg-emerald-700 rounded-full" />}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-3 border-t border-slate-50">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-600 text-[12px] font-bold transition-all group rounded-xl hover:bg-red-50">
                            <LogOut size={16} className="group-hover:translate-x-1 transition-transform" /> <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT (KANAN) --- */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
                {/* Header (Glassmorphism Modern - Hijau Tua) */}
                <header className="h-14 bg-white/80 backdrop-blur-md border-b border-emerald-50/50 px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 bg-emerald-50 rounded-lg text-emerald-600"><Menu size={18} /></button>
                        <h2 className="text-[12px] font-black text-slate-800 tracking-widest leading-none uppercase italic border-l-2 border-emerald-600 pl-3">
                            {navItems.find(i => i.href === pathname)?.name || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative hidden md:block group">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300 group-focus-within:text-emerald-500 transition-colors" />
                            <input type="text" placeholder="Global search..." className="pl-9 pr-4 py-1.5 bg-emerald-50/50 border border-transparent rounded-full text-[11px] w-52 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all" />
                        </div>

                        <button onClick={handleSyncAI} disabled={isSyncing} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all ${isSyncing ? "bg-slate-100 text-slate-400" : "bg-white text-emerald-600 border-emerald-100 hover:bg-emerald-50"}`}>
                            <Database size={14} className={isSyncing ? "animate-spin" : ""} /> {isSyncing ? "SYNC..." : "SYNC AI"}
                        </button>

                        <div className="h-5 w-[1px] bg-emerald-100 mx-1" />

                        {/* Tombol Profile & Dropdown Modern */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-all group"
                            >
                                <div className="text-right hidden sm:block leading-none">
                                    <p className="text-[11px] font-black text-slate-900 uppercase">Administrator</p>
                                    <p className="text-[9px] text-emerald-600 font-bold tracking-widest mt-0.5 italic uppercase">Verified</p>
                                </div>
                                <div className="relative transition-transform active:scale-90 group-hover:scale-105">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 shadow-sm" alt="avatar" />
                                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
                                </div>
                            </button>

                            {/* Dropdown Profile Menu */}
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-emerald-100/30 overflow-hidden z-50"
                                    >
                                        {/* Header Section */}
                                        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 p-4 text-white">
                                            <div className="flex items-center gap-3 mb-3">
                                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-10 h-10 rounded-xl border-2 border-white/30" alt="avatar" />
                                                <div className="flex-1">
                                                    <p className="text-[13px] font-black uppercase">admin</p>
                                                    <p className="text-[10px] font-bold opacity-80 tracking-wide">SUPER ADMIN</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Email Section */}
                                        <div className="px-4 py-3 border-b border-slate-100/50">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Signed in as</p>
                                            <p className="text-[12px] font-bold text-slate-700">admin@klinik.ai</p>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-2 px-2">
                                            {profileMenuItems.map((item, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={item.action}
                                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[12px] font-bold transition-all ${item.color
                                                            ? 'text-red-600 hover:bg-red-50'
                                                            : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                                                        }`}
                                                >
                                                    <span className={item.color || 'text-emerald-600'}>{item.icon}</span>
                                                    {item.name}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Konten dengan Animasi */}
                <div className="flex-1 p-6 lg:p-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
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