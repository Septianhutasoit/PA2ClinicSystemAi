'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import {
    LayoutDashboard,
    Users2,
    UserRoundCog,
    CalendarCheck2,
    BellRing,
    BrainCircuit,
    Stethoscope,
    Search,
    LogOut,
    Database,
    Menu,
    X,
    Settings2,
    AlarmClockCheck,
    Loader2 // Ikon loading
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSyncing, setIsSyncing] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // 1. PROTEKSI RUTE & ROLE (SATURATED GUARD)
    useEffect(() => {
        const token = localStorage.getItem('token') || Cookies.get('token');
        const role = localStorage.getItem('user_role') || Cookies.get('role');

        if (!token) {
            router.push('/login');
        } else if (role?.toLowerCase() !== 'admin') {
            alert("Akses Ditolak: Area ini khusus untuk Administrator. Role Anda: " + role);
            router.push('/'); // Lempar ke landing page jika bukan admin
        } else {
            setIsAuthorized(true);
        }
    }, [pathname, router]); // Cek ulang setiap ganti rute

    const handleSyncAI = async () => {
        const confirmSync = confirm("Perbarui database pengetahuan AI sekarang? Ini mungkin memakan waktu beberapa detik.");
        if (!confirmSync) return;
        setIsSyncing(true);
        try {
            await api.post('/chatbot/ingest');
            alert("✅ Brain Database AI berhasil disinkronkan!");
        } catch (err) {
            alert("❌ Gagal memperbarui AI.");
        } finally {
            setIsSyncing(false);
        }
    };

    const handleLogout = () => {
        if (confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
            // Hapus SEMUA jejak login
            localStorage.removeItem('token');
            localStorage.removeItem('user_role');
            Cookies.remove('token');
            Cookies.remove('role');
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

    // Tampilan saat sistem sedang memverifikasi role (UX yang lebih baik)
    if (!isAuthorized) {
        return (
            <div className="h-screen w-screen bg-white flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mengamankan Akses Admin...</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#F8F9FD] text-[#475569] font-sans overflow-hidden">
            {/* SIDEBAR */}
            <aside className={`
                fixed lg:relative z-50 w-64 h-screen bg-white border-r border-slate-200 transition-transform duration-300
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full">
                    <div className="p-4 flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md font-black italic text-xs">K</div>
                        <h1 className="text-base font-black tracking-tighter text-slate-900 leading-none">Klinik.AI</h1>
                    </div>

                    <div className="mx-4 mb-4 p-2.5 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">Nauli Dental Care</p>
                        <p className="text-[9px] text-slate-600 truncate italic mt-1 font-bold">Jl. Balige No. 12, Toba</p>
                    </div>

                    <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] px-3 mb-2 opacity-60">Admin System</p>
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href} className="block group">
                                    <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all relative ${isActive ? "bg-blue-50/80 text-blue-600 font-bold" : "text-slate-900 hover:bg-slate-50"
                                        }`}>
                                        {isActive && <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-4 bg-blue-600 rounded-r-full" />}
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${isActive ? item.bg : "bg-transparent group-hover:" + item.bg}`}>
                                            <span className={isActive ? item.color : "text-slate-300 group-hover:" + item.color}>{item.icon}</span>
                                        </div>
                                        <span className="text-[13px] tracking-tight font-bold">{item.name}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-3 border-t border-slate-50">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-700 text-[12px] font-bold transition-all group">
                            <LogOut size={16} className="group-hover:translate-x-1 transition-transform" /> <span className="font-bold uppercase tracking-tighter">Logout</span>
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
                        <h2 className="text-sm font-black text-slate-800 hidden sm:block tracking-tight">
                            {navItems.find(i => i.href === pathname)?.name || 'Admin Panel'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={handleSyncAI} disabled={isSyncing} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-black border transition-all ${isSyncing ? "bg-slate-100 text-slate-400" : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50 shadow-sm"}`}>
                            <Database size={14} className={isSyncing ? "animate-spin" : ""} /> {isSyncing ? "Syncing AI..." : "Sync AI"}
                        </button>

                        <div className="h-6 w-[1px] bg-slate-200 mx-1" />

                        <div className="flex items-center gap-3 pl-2 group cursor-pointer relative" onClick={handleLogout}>
                            <div className="text-right hidden sm:block leading-none">
                                <p className="text-[11px] font-black text-slate-900 uppercase leading-none">Admin Utama</p>
                                <p className="text-[9px] text-blue-600 font-bold tracking-tighter italic mt-1 leading-none">Verified Super Admin</p>
                            </div>
                            <div className="relative transition-transform active:scale-95">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="w-8 h-8 rounded-lg bg-blue-50 border border-slate-200 shadow-sm" alt="avatar" />
                                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
                            </div>
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