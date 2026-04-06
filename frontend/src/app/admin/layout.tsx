'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import {
    LayoutDashboard, Users2, UserRoundCog, CalendarCheck2,
    BellRing, BrainCircuit, Stethoscope, Search, LogOut,
    Database, Menu, X, Settings2, AlarmClockCheck, Loader2,
    ChevronRight, Sparkles
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSyncing, setIsSyncing] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token') || Cookies.get('token');
        const role = localStorage.getItem('user_role') || Cookies.get('role');

        if (!token) {
            router.push('/login');
        } else if (role?.toLowerCase() !== 'admin') {
            alert("Akses Ditolak: Area khusus Administrator.");
            router.push('/');
        } else {
            setIsAuthorized(true);
        }
    }, [pathname, router]);

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

    const handleLogout = () => {
        if (confirm("Keluar dari sistem?")) {
            localStorage.clear();
            Cookies.remove('token');
            router.push('/login');
        }
    };

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} />, color: 'text-blue-600', bg: 'bg-blue-50' },
        { name: 'Reservations', href: '/admin/appointments', icon: <CalendarCheck2 size={18} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { name: 'Daftar Pasien', href: '/admin/patients', icon: <Users2 size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { name: 'Manajemen Dokter', href: '/admin/doctors', icon: <UserRoundCog size={18} />, color: 'text-rose-600', bg: 'bg-rose-50' },
        { name: 'Manajemen Jadwal', href: '/admin/schedules', icon: <AlarmClockCheck size={18} />, color: 'text-amber-600', bg: 'bg-amber-50' },
        { name: 'AI Knowledge', href: '/admin/knowledge', icon: <BrainCircuit size={18} />, color: 'text-purple-600', bg: 'bg-purple-50' },
        { name: 'Layanan Klinik', href: '/admin/services', icon: <Stethoscope size={18} />, color: 'text-cyan-600', bg: 'bg-cyan-50' },
        { name: 'Pengaturan', href: '/admin/settings', icon: <Settings2 size={18} />, color: 'text-slate-600', bg: 'bg-slate-100' },
    ];

    if (!isAuthorized) return (
        <div className="h-screen w-screen bg-white flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verifikasi Keamanan Admin...</p>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[#F1F5F9] text-[#1E293B] font-sans overflow-hidden">

            {/* --- SIDEBAR (WHITE) --- */}
            <aside className={`fixed lg:relative z-50 w-64 h-screen bg-white border-r border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="flex flex-col h-full">
                    {/* Brand Logo */}
                    <div className="p-6 flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 font-black italic text-sm">K</div>
                        <h1 className="text-xl font-black tracking-tighter text-slate-800 leading-none">Klinik.<span className="text-blue-600">AI</span></h1>
                    </div>

                    {/* Clinic Address Card */}
                    <div className="mx-4 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">Nauli Dental Care</p>
                        <p className="text-[10px] text-slate-500 font-medium truncate mt-1 italic">Jl. Balige No. 12, Toba</p>
                    </div>

                    {/* Navigation Scroll Area */}
                    <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto custom-scrollbar">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-3 opacity-60">Admin System</p>
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href} className="block group">
                                    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all relative ${isActive ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${isActive ? "bg-white/20" : item.bg}`}>
                                            <span className={isActive ? "text-white" : item.color}>{item.icon}</span>
                                        </div>
                                        <span className={`text-[13px] font-bold tracking-tight ${isActive ? "text-white" : "text-slate-700"}`}>{item.name}</span>
                                        {isActive && <motion.div layoutId="nav-line" className="absolute -left-1 w-1 h-5 bg-blue-600 rounded-full" />}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout Section */}
                    <div className="p-4 border-t border-slate-50">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-600 text-[13px] font-bold transition-all group">
                            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" /> <span>Logout System</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT (GRAY BG) --- */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header Section (Glassmorphism) */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-8 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 bg-slate-50 rounded-lg text-slate-500"><Menu size={20} /></button>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 opacity-60 italic">Management Suite</p>
                            <h2 className="text-base font-black text-slate-800 tracking-tight leading-none uppercase">
                                {navItems.find(i => i.href === pathname)?.name || 'Dashboard'}
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        {/* Search Pill */}
                        <div className="relative hidden md:block group">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input type="text" placeholder="Global search..." className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-xs w-64 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all shadow-sm" />
                        </div>

                        {/* Sync Button */}
                        <button onClick={handleSyncAI} disabled={isSyncing} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all ${isSyncing ? "bg-slate-100 text-slate-400 border-slate-200" : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50 shadow-sm"}`}>
                            <Database size={14} className={isSyncing ? "animate-spin" : ""} /> {isSyncing ? "PROCESSING..." : "SYNC AI"}
                        </button>

                        <div className="h-6 w-[1px] bg-slate-200 mx-1" />

                        {/* Profile Card */}
                        <div className="flex items-center gap-3 pl-2 group cursor-pointer relative" onClick={handleLogout}>
                            <div className="text-right hidden sm:block leading-none">
                                <p className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">Administrator</p>
                                <p className="text-[9px] text-blue-600 font-bold tracking-widest mt-1 italic uppercase">Verified</p>
                            </div>
                            <div className="relative transition-transform active:scale-95">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-9 h-9 rounded-xl bg-blue-50 border border-slate-200 shadow-sm" alt="avatar" />
                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Transitions */}
                <div className="flex-1 overflow-y-auto p-8 lg:p-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="max-w-[1600px] mx-auto"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Mobile Backdrop */}
            {isMobileMenuOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
        </div>
    );
}