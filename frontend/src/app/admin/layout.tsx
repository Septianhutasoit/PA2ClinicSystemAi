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
    Plus,
    LogOut,
    Database,
    Menu,
    X,
    Settings2,
    AlarmClockCheck,
    ChevronRight
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSyncing, setIsSyncing] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

<<<<<<< HEAD
    // PROTEKSI RUTE: Cek token DAN role setiap kali halaman dimuat
=======
    // 1. PROTEKSI RUTE & ROLE: Memastikan hanya ADMIN yang bisa masuk sini
>>>>>>> b75e52e9e240aba7bb4e2f997384222f86b05267
    useEffect(() => {
        const token = localStorage.getItem('token') || Cookies.get('token');
        const role = localStorage.getItem('user_role') || Cookies.get('role');

        if (!token) {
<<<<<<< HEAD
            router.push('/login'); // Jika tidak ada token, usir ke login
        } else if (role !== 'admin') {
            alert('⛔ Akses ditolak: Anda bukan admin');
            router.push('/login'); // Jika bukan admin, usir ke login
        } else {
            setIsAuthorized(true); // Jika ada token DAN role admin, izinkan
=======
            router.push('/login');
        } else if (role?.toLowerCase() !== 'admin') {
            // Jika bukan admin (misal pasien coba-coba masuk), lempar ke halaman depan
            alert("Akses Terbatas: Hanya Administrator yang diizinkan.");
            router.push('/');
        } else {
            setIsAuthorized(true);
>>>>>>> b75e52e9e240aba7bb4e2f997384222f86b05267
        }
    }, [router]);

    // 2. FUNGSI SYNC AI (Sudah diperbaiki penutup kurungnya)
    const handleSyncAI = async () => {
        const confirmSync = confirm("Update Database AI Knowledge?");
        if (!confirmSync) return;
        setIsSyncing(true);
        try {
            await api.post('/chatbot/ingest');
            alert("✅ AI Knowledge Updated!");
        } catch (err) {
            alert("❌ Sync Failed");
        } finally {
            setIsSyncing(false);
        }
    };

<<<<<<< HEAD
    if (!isAuthorized) return null;
=======
    // 3. FUNGSI LOGOUT (Disesuaikan untuk menghapus Role juga)
    const handleLogout = () => {
        if (confirm("Apakah Anda yakin ingin keluar dari sistem admin?")) {
            localStorage.removeItem('token');
            localStorage.removeItem('user_role');
            Cookies.remove('token');
            Cookies.remove('role');
            router.push('/login');
        }
    };
>>>>>>> b75e52e9e240aba7bb4e2f997384222f86b05267

    // Navigasi Item (Sesuai Rencana Role Admin)
    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} />, color: 'text-blue-600', bg: 'bg-blue-50' },
        { name: 'Reservations', href: '/admin/appointments', icon: <CalendarCheck2 size={18} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { name: 'Daftar Pasien', href: '/admin/patients', icon: <Users2 size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { name: 'Manajemen Dokter', href: '/admin/doctors', icon: <UserRoundCog size={18} />, color: 'text-rose-600', bg: 'bg-rose-50' },
        { name: 'Manajemen Jadwal', href: '/admin/schedules', icon: <AlarmClockCheck size={18} />, color: 'text-amber-600', bg: 'bg-amber-50' },
        { name: 'Notifikasi n8n', href: '/admin/knowledge', icon: <BrainCircuit size={18} />, color: 'text-purple-600', bg: 'bg-purple-50' },
        { name: 'Layanan Klinik', href: '/admin/service', icon: <Stethoscope size={18} />, color: 'text-cyan-600', bg: 'bg-cyan-50' },
        { name: 'Pengaturan', href: '/admin/settings', icon: <Settings2 size={18} />, color: 'text-slate-600', bg: 'bg-slate-100' },
    ];

    if (!isAuthorized) return null;

    return (
        <div className="flex min-h-screen bg-[#F8F9FD] text-[#475569] font-sans overflow-hidden">

            {/* SIDEBAR */}
            <aside className={`
                fixed lg:relative z-50 w-64 h-screen bg-white border-r border-slate-200 transition-transform duration-300
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-4 flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md font-black italic text-xs">K</div>
                        <h1 className="text-base font-black tracking-tighter text-slate-900 leading-none">Klinik.AI</h1>
                    </div>

                    {/* Alamat */}
                    <div className="mx-4 mb-4 p-2.5 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight leading-none">Nauli Dental Care</p>
                        <p className="text-[9px] text-slate-500 truncate italic mt-1 font-bold">Jl. Balige No. 12, Toba</p>
                    </div>

                    {/* Navigasi */}
                    <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] px-3 mb-2 opacity-60">Admin Control</p>
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

<<<<<<< HEAD
                    <div className="p-3 border-t border-slate-100">
                        <button
                            onClick={handleLogout} // Tambahkan onClick di sini
                            className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-700 text-[13px] font-medium transition-colors group"
                        >
                            <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                            <span className="font-bold">Logout</span>
=======
                    {/* Logout Section */}
                    <div className="p-3 border-t border-slate-50">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-700 text-[12px] font-bold transition-all group">
                            <LogOut size={16} className="group-hover:translate-x-1 transition-transform" /> <span className="font-bold uppercase tracking-tighter">Keluar Sistem</span>
>>>>>>> b75e52e9e240aba7bb4e2f997384222f86b05267
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
                        {/* Judul Dinamis sesuai halaman */}
                        <h2 className="text-sm font-black text-slate-800 hidden sm:block tracking-tight">
                            {navItems.find(i => i.href === pathname)?.name || 'Admin Panel'}
                        </h2>

                        <div className="relative ml-4 hidden md:block group">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                            <input type="text" placeholder="Cari data..." className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs w-64 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all shadow-sm" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Sync AI Button */}
                        <button onClick={handleSyncAI} disabled={isSyncing} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-black border transition-all ${isSyncing ? "bg-slate-100 text-slate-400 border-slate-200" : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50 shadow-sm"}`}>
                            <Database size={14} className={isSyncing ? "animate-spin" : ""} /> {isSyncing ? "Updating AI..." : "Sync AI"}
                        </button>

                        <div className="h-6 w-[1px] bg-slate-200 mx-1" />

                        {/* Profile & Role Info */}
                        <div className="flex items-center gap-3 pl-2 group cursor-pointer relative" onClick={handleLogout}>
                            <div className="text-right hidden sm:block leading-none">
                                <p className="text-[11px] font-black text-slate-900 uppercase">Admin Utama</p>
                                <p className="text-[9px] text-blue-600 font-bold tracking-tighter italic">Verified Super Admin</p>
                            </div>
                            <div className="relative transition-transform active:scale-95">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="w-8 h-8 rounded-lg bg-blue-50 border border-slate-200 shadow-sm" alt="avatar" />
                                {/* Status Dot Hijau Berdenyut */}
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

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            )}
        </div>
    );
}