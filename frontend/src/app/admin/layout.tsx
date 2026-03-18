'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import api from '@/services/api';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users2,
    UserRoundCog,
    CalendarCheck2,
    BellRing,
    BrainCircuit,
    Stethoscope,
    Search,
    Plus,
    LogOut,
    Database,
    Menu,
    X,
    Settings2,
    AlarmClockCheck
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSyncing, setIsSyncing] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const handleSyncAI = async () => {
        const confirmSync = confirm("Update Database AI?");
        if (!confirmSync) return;
        setIsSyncing(true);
        try {
            await api.post('/chatbot/ingest');
            alert("✅ AI Knowledge Updated!");
        } catch (err) { alert("❌ Sync Failed"); }
        finally { setIsSyncing(false); }
    };

    // Navigasi dengan tambahan warna (bg & icon color)
    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} />, color: 'text-blue-600', bg: 'bg-blue-50' },
        { name: 'Daftar Konsultasi', href: '/admin/appointments', icon: <CalendarCheck2 size={18} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { name: 'Daftar Pasien', href: '/admin/patients', icon: <Users2 size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { name: 'Manajemen Dokter', href: '/admin/doctors', icon: <UserRoundCog size={18} />, color: 'text-rose-600', bg: 'bg-rose-50' },
        { name: 'Manajemen Jadwal', href: '/admin/schedules', icon: <AlarmClockCheck size={18} />, color: 'text-amber-600', bg: 'bg-amber-50' },
        { name: 'Notifikasi n8n', href: '/admin/knowledge', icon: <BrainCircuit size={18} />, color: 'text-purple-600', bg: 'bg-purple-50' },
        { name: 'Layanan', href: '/admin/service', icon: <Stethoscope size={18} />, color: 'text-cyan-600', bg: 'bg-cyan-50' },
        { name: 'Pengaturan', href: '/admin/settings', icon: <Settings2 size={18} />, color: 'text-slate-600', bg: 'bg-slate-100' },
    ];

    return (
        <div className="flex min-h-screen bg-[#F8F9FD] text-[#475569] font-sans overflow-hidden">

            {/* SIDEBAR */}
            <aside className={`
                fixed lg:relative z-50 w-64 h-screen bg-white border-r border-slate-200 transition-transform duration-300
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="p-6 flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <span className="font-black text-sm italic">K</span>
                        </div>
                        <h1 className="text-lg font-bold tracking-tight text-slate-800">Klinik.AI</h1>
                    </div>

                    <div className="mx-4 mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">Klinik Gigi Sehat</p>
                        <p className="text-[10px] text-slate-400 truncate">Jl. Balige No. 12, Toba</p>
                    </div>

                    <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.15em] px-3 mb-2">Main Menu</p>
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href} className="block group">
                                    <div className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all relative ${isActive ? "bg-blue-50/50 text-blue-600 font-semibold" : "text-slate-500 hover:bg-slate-50"
                                        }`}>
                                        {isActive && (
                                            <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-5 bg-blue-600 rounded-r-full" />
                                        )}

                                        {/* Colored Icon Container */}
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isActive ? item.bg : "bg-transparent group-hover:" + item.bg
                                            }`}>
                                            <span className={isActive ? item.color : "text-slate-300 group-hover:" + item.color}>
                                                {item.icon}
                                            </span>
                                        </div>

                                        <span className="text-[13px]">{item.name}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-100">
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-500 text-[13px] font-medium transition-colors">
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <h2 className="text-sm font-bold text-slate-800 hidden sm:block">
                            {navItems.find(i => i.href === pathname)?.name || 'Dashboard'}
                        </h2>

                        <div className="relative ml-4 hidden md:block group">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search data..."
                                className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs w-64 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSyncAI}
                            disabled={isSyncing}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${isSyncing
                                ? "bg-slate-100 text-slate-400 border-slate-200"
                                : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                                }`}
                        >
                            <Database size={14} className={isSyncing ? "animate-spin" : ""} />
                            {isSyncing ? "Syncing..." : "Sync AI"}
                        </button>

                        <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full relative transition-colors">
                            <BellRing size={18} />
                            <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        <div className="h-6 w-[1px] bg-slate-200 mx-1" />

                        <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                            <div className="text-right hidden sm:block">
                                <p className="text-[11px] font-bold text-slate-800 leading-none group-hover:text-blue-600 transition-colors">Admin Klinik</p>
                                <p className="text-[9px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">Super Admin</p>
                            </div>
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                                className="w-8 h-8 rounded-lg bg-blue-50 border border-slate-200 shadow-sm"
                                alt="avatar"
                            />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 lg:p-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="max-w-7xl mx-auto"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            )}
        </div>
    );
}