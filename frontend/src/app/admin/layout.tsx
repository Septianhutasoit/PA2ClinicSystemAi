'use client';
import Link from 'next/link';
import { useEffect, useState, useRef, use } from 'react';
import api from '@/services/api';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import Image from 'next/image';
import {
    LayoutDashboard, Users2, UserRoundCog, CalendarCheck2,
    BellRing, BrainCircuit, Stethoscope, Search, LogOut,
    Database, Menu, X, Settings2, AlarmClockCheck, Loader2,
    ChevronRight, ChevronDown, Sparkles, UserCircle, Shield,
    Lock, CheckCheck, CalendarClock, UserPlus, AlertCircle,
    BarChart,
    MessageSquare
} from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
    {
        id: 1,
        icon: <CalendarClock size={14} />,
        color: 'text-teal-600 bg-teal-50',
        title: 'Reservasi Baru',
        desc: 'Pasien Andi Siregar — 14:00 hari ini',
        time: '2 mnt lalu',
        read: false,
    },
    {
        id: 2,
        icon: <UserPlus size={14} />,
        color: 'text-emerald-600 bg-emerald-50',
        title: 'Pasien Terdaftar',
        desc: 'Siti Rahma baru mendaftar ke sistem',
        time: '15 mnt lalu',
        read: false,
    },
    {
        id: 3,
        icon: <AlertCircle size={14} />,
        color: 'text-amber-600 bg-amber-50',
        title: 'Jadwal Konflik',
        desc: 'Dr. Budi — slot 10:00 bentrok',
        time: '1 jam lalu',
        read: false,
    },
    {
        id: 4,
        icon: <CheckCheck size={14} />,
        color: 'text-slate-500 bg-slate-100',
        title: 'Sync AI Selesai',
        desc: 'Knowledge base berhasil diperbarui',
        time: '3 jam lalu',
        read: true,
    },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSyncing, setIsSyncing] = useState(false);
    const [showSyncModal, setShowSyncModal] = useState(false);
    const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [syncStatus, setSyncStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [syncMessage, setSyncMessage] = useState("");

    // ── sidebar collapse (desktop)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const profileRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);
    const unreadCount = notifications.filter(n => !n.read).length;

    const pathname = usePathname();
    const router = useRouter();

    // fetch notifications dari backend
    const refreshNotifications = async () => {
        try {
            const res = await api.get('/clinic/admin/notifications/reservations', { timeout: 10000 });
            const dynamicNotifs = res.data.map((n: any) => ({
                id: n.id,
                icon: n.status === 'pending' ? <CalendarClock size={14} /> : <CheckCheck size={14} />,
                color: n.status === 'pending' ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50',
                title: n.title,
                desc: `Pasien ${n.patient_name} — ${n.consultation_time}`,
                time: n.consultation_date,
                read: n.status !== 'pending'
            }));
            setNotifications(dynamicNotifs);
            setPendingCount(res.data.filter((a: any) => a.status === 'pending').length);
        } catch {
            // Silent — jangan log error notifikasi agar tidak spam console
        }
    };

    // 1. PROTEKSI RUTE
    useEffect(() => {
        const token = localStorage.getItem('token') || Cookies.get('token');
        const role = localStorage.getItem('user_role') || Cookies.get('role');
        if (!token) {
            router.push('/login');
        } else if (role?.toLowerCase() !== 'admin') {
            alert('⛔ Akses ditolak: Anda bukan admin');
            router.push('/login');
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    // 2. CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node))
                setIsProfileOpen(false);
            if (notifRef.current && !notifRef.current.contains(e.target as Node))
                setIsNotifOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Notifikasi
    useEffect(() => {
        if (!isAuthorized) return;
        refreshNotifications();
        const timer = setInterval(refreshNotifications, 30000);
        return () => clearInterval(timer);
    }, [isAuthorized]);

    // 3. LOGOUT
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_role');
        Cookies.remove('token');
        Cookies.remove('role');
        window.location.href = '/login';
    };

    // 4. SYNC AI
    const handleSyncAI = () => setShowSyncModal(true);

    const executeSyncAI = async () => {
        setShowSyncModal(false);   // ← tutup modal konfirmasi dulu
        setIsSyncing(true);
        setSyncResult(null);       // ← reset result sebelumnya

        try {
            const res = await api.post('/chatbot/ingest', {}, { timeout: 120000 });
            setSyncResult({
                success: true,
                message: res.data.message || 'AI berhasil diperbarui.'
            });
        } catch (err: any) {
            // Ambil pesan error dengan aman
            const detail = err?.response?.data?.detail;
            const status = err?.response?.status;
            const isCors = !err?.response && err?.message === 'Network Error';

            let msg = '';
            if (isCors || !err?.response) {
                msg = '❌ Tidak dapat terhubung ke server. Pastikan backend Python berjalan.';
            } else if (status === 500) {
                msg = `❌ Server error: ${typeof detail === 'string' ? detail : 'Cek terminal Python.'}`;
            } else if (status === 404) {
                msg = '❌ Endpoint tidak ditemukan. Cek include_router di main.py.';
            } else {
                msg = `❌ Error ${status}: ${err?.message || 'Unknown'}`;
            }

            setSyncResult({ success: false, message: msg });
        } finally {
            setIsSyncing(false);   // ← WAJIB — buka tombol kembali
        }
    };

    const markAllRead = () =>
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    const markRead = (id: number) =>
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={16} />, color: 'text-emerald-600' },
        { name: 'Reservations', href: '/admin/appointments', icon: <CalendarCheck2 size={16} />, color: 'text-teal-600' },
        { name: 'Notifikasi', href: '/admin/notifications', icon: <BellRing size={16} />, color: 'text-emerald-500' },
        { name: 'Daftar Pasien', href: '/admin/patients', icon: <Users2 size={16} />, color: 'text-green-600' },
        { name: 'Kelola Staff', href: '/admin/doctors', icon: <UserRoundCog size={16} />, color: 'text-emerald-600' },
        { name: 'AI Data', href: '/admin/ai-data', icon: <MessageSquare size={16} />, color: 'text-green-600' },
        { name: 'AI Knowledge', href: '/admin/knowledge', icon: <BrainCircuit size={16} />, color: 'text-teal-600' },
        { name: 'Layanan Klinik', href: '/admin/services', icon: <Stethoscope size={16} />, color: 'text-green-600' },
        { name: 'Pengaturan', href: '/admin/settings', icon: <Settings2 size={16} />, color: 'text-emerald-600' },
    ];

    const profileMenuItems = [
        { name: 'View Profile', icon: <UserCircle size={16} />, action: () => { setIsProfileOpen(false); router.push('/admin/profile'); } },
        { name: 'Change Account', icon: <Shield size={16} />, action: () => { setIsProfileOpen(false); router.push('/admin/change-account'); } },
        { name: 'Sign Out', icon: <LogOut size={16} />, action: handleLogout, color: 'text-red-600' },
    ];

    if (!isAuthorized) {
        return (
            <div className="h-screen w-screen bg-white flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-emerald-600" size={40} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mengamankan Akses Admin...</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#F0F9F7] text-[#1E293B] font-sans">

            {/* ═══ SIDEBAR ═══════════════════════════════════════════════════ */}
            {/* Mobile: slide in/out | Desktop: collapse to icon-only */}
            <aside className={`
                fixed lg:sticky lg:top-0 z-30 h-screen
                bg-white border-r border-emerald-50/50 shadow-sm
                flex flex-col
                transition-all duration-150
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                ${isSidebarOpen ? 'w-64' : 'w-[72px]'}
            `}>
                <div className="flex flex-col h-full">

                    {/* Logo */}
                    <div className={`border-b border-emerald-50/50 shrink-0 flex items-center transition-all duration-150 ${isSidebarOpen ? 'p-5 gap-3 justify-start' : 'p-3 justify-center'
                        }`}>
                        {/* Box Logo K - Dibuat lebih besar (w-12 h-12) */}
                        <div className={`rounded-2xl overflow-hidden flex items-center justify-center bg-white ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-200/60 p-1 shrink-0 transition-all duration-150 ${isSidebarOpen ? 'w-11 h-11' : 'w-12 h-12 mx-auto'
                            }`}>
                            <Image
                                src="/images/Logo.png"
                                alt="Nauli Dental Logo"
                                width={44}
                                height={44}
                                className="object-contain w-full h-full"
                                onError={(e) => {
                                    // fallback jika gambar gagal load
                                    const el = e.currentTarget as HTMLImageElement;
                                    el.style.display = 'none';
                                    const parent = el.parentElement;
                                    if (parent) {
                                        parent.classList.add('bg-[#006D44]');
                                        parent.innerHTML = '<span class="text-white font-black italic text-xl">K</span>';
                                    }
                                }}
                            />
                        </div>

                        <AnimatePresence>
                            {isSidebarOpen && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="flex flex-col leading-none overflow-hidden"
                                >
                                    <h1 className="text-[17px] font-black tracking-tighter text-slate-800 whitespace-nowrap">
                                        Nauli <span className="text-[#006D44]">Dental</span>
                                    </h1>
                                    <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-[0.2em] mt-1 whitespace-nowrap">
                                        Clinic Care
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Clinic Info — hanya tampil saat sidebar terbuka */}
                    <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mx-3 mt-4 mb-2 p-3 bg-emerald-50/40 rounded-xl border border-emerald-100/50 overflow-hidden"
                            >
                                <p className="text-[10px] font-black text-emerald-900 uppercase leading-none">Nauli Dental Care</p>
                                <p className="text-[9px] text-emerald-600 font-bold truncate mt-1 italic opacity-70">Jl. Balige No. 12, Toba</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Nav */}
                    <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto py-2">
                        {isSidebarOpen && (
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-3 mb-2 opacity-60">
                                Admin System
                            </p>
                        )}

                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    title={!isSidebarOpen ? item.name : undefined}
                                    className="block group"
                                >
                                    <div className={`
                                        flex items-center gap-2.5 px-3 py-2 rounded-xl
                                        transition-all relative
                                        ${isActive
                                            ? 'bg-emerald-700 text-white shadow-md shadow-emerald-200'
                                            : 'text-slate-600 hover:bg-emerald-50/50 hover:text-emerald-700'
                                        }
                                    `}>
                                        {/* Active line indicator */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-line"
                                                className="absolute -left-1 w-1 h-4 bg-emerald-700 rounded-full"
                                            />
                                        )}

                                        {/* Ikon */}
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${isActive ? 'bg-white/20' : 'bg-transparent'}`}>
                                            <span className={isActive ? 'text-white' : item.color}>
                                                {item.icon}
                                            </span>
                                        </div>

                                        {/* Label — muncul hanya saat sidebar terbuka */}
                                        <AnimatePresence>
                                            {isSidebarOpen && (
                                                <motion.span
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.12 }}
                                                    className={`text-[12px] font-bold tracking-tight truncate ${isActive ? 'text-white' : ''}`}
                                                >
                                                    {item.name}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>

                                        {/* Tooltip saat ikon saja */}
                                        {!isSidebarOpen && (
                                            <div className="absolute left-full ml-3 px-3 py-1.5 bg-emerald-900 text-white text-[11px] font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50 shadow-lg">
                                                {item.name}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-3 border-t border-slate-100 shrink-0">
                        <button
                            onClick={handleLogout}
                            title={!isSidebarOpen ? 'Logout' : undefined}
                            className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-600 text-[12px] font-bold transition-all group rounded-xl hover:bg-red-50"
                        >
                            <LogOut size={16} className="group-hover:translate-x-1 transition-transform shrink-0" />
                            <AnimatePresence>
                                {isSidebarOpen && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.12 }}
                                    >
                                        Logout
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </aside>

            {/* ═══ MAIN CONTENT ══════════════════════════════════════════════ */}
            <main className={`flex-1 flex flex-col min-w-0 h-screen overflow-y-auto transition-all duration-300`}>

                {/* ── HEADER ─────────────────────────────────────────────── */}
                <header className="h-14 bg-white/80 backdrop-blur-md border-b border-emerald-50/50 px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
                    <div className="flex items-center gap-3">
                        {/* Toggle sidebar — desktop */}
                        <button
                            onClick={(e) => { e.preventDefault(); setIsSidebarOpen(v => !v); }}
                            className="hidden lg:flex p-2 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
                        >
                            <Menu size={18} />
                        </button>

                        {/* Toggle sidebar — mobile */}
                        <button
                            onClick={() => setIsMobileMenuOpen(v => !v)}
                            className="lg:hidden p-2 bg-emerald-50 rounded-lg text-emerald-600"
                        >
                            <Menu size={18} />
                        </button>
                        <h2 className="text-[12px] font-black text-slate-800 tracking-widest leading-none uppercase italic border-l-2 border-emerald-600 pl-3">
                            {navItems.find(i => i.href === pathname)?.name || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">

                        {/* Sync AI */}
                        <button onClick={handleSyncAI} disabled={isSyncing} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all ${isSyncing ? 'bg-slate-100 text-slate-400' : 'bg-white text-emerald-600 border-emerald-100 hover:bg-emerald-50'}`}>
                            <Database size={14} className={isSyncing ? 'animate-spin' : ''} /> {isSyncing ? 'SYNC...' : 'SYNC AI'}
                        </button>

                        <div className="h-5 w-[1px] bg-emerald-100 mx-1" />

                        {/* ── NOTIFIKASI ── */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => { setIsNotifOpen(v => !v); setIsProfileOpen(false); }}
                                title="Notifikasi"
                                className={`relative p-2 rounded-lg transition-all duration-200 ${isNotifOpen ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/20' : 'text-slate-400 hover:text-white hover:bg-emerald-800 hover:shadow-md hover:shadow-emerald-900/10'}`}
                            >
                                <BellRing size={16} />
                                <AnimatePresence>
                                    {pendingCount > 0 && (
                                        <motion.span
                                            key="badge"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white leading-none"
                                        >
                                            {pendingCount}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>

                            <AnimatePresence>
                                {isNotifOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-emerald-100/30 overflow-hidden z-50"
                                    >
                                        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-4 py-3 flex items-center justify-between">
                                            <div>
                                                <p className="text-[12px] font-black text-white uppercase tracking-wide">Notifikasi</p>
                                                <p className="text-[9px] text-emerald-200 font-bold mt-0.5">{unreadCount} belum dibaca</p>
                                            </div>
                                            {unreadCount > 0 && (
                                                <button onClick={markAllRead} className="flex items-center gap-1 px-2 py-1 bg-white/15 hover:bg-white/25 text-white text-[9px] font-black rounded-lg transition-all uppercase tracking-wide">
                                                    <CheckCheck size={11} /> Tandai semua
                                                </button>
                                            )}
                                        </div>
                                        <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="py-10 text-center space-y-2">
                                                    <BellRing size={24} className="mx-auto text-slate-200" />
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        Tidak ada aktivitas
                                                    </p>
                                                </div>
                                            ) : (
                                                notifications.map(notif => (
                                                    <button
                                                        key={notif.id}
                                                        onClick={() => {
                                                            markRead(notif.id);
                                                            setIsNotifOpen(false);
                                                            router.push('/admin/notifications');
                                                        }}
                                                        className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-all hover:bg-emerald-50/60 ${!notif.read ? 'bg-emerald-50/30' : ''}`}
                                                    >
                                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${notif.color}`}>
                                                            {notif.icon}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <p className={`text-[11px] font-black truncate ${!notif.read ? 'text-slate-800' : 'text-slate-500'}`}>
                                                                    {notif.title}
                                                                </p>
                                                                {!notif.read && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />}
                                                            </div>
                                                            <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{notif.desc}</p>
                                                            <p className="text-[9px] text-slate-400 mt-1 font-bold italic">{notif.time}</p>
                                                        </div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
                                            <button
                                                onClick={() => { setIsNotifOpen(false); router.push('/admin/notifications'); }}
                                                className="w-full text-[10px] font-black text-emerald-700 hover:text-emerald-900 uppercase tracking-widest transition-colors"
                                            >
                                                Lihat semua notifikasi →
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="h-5 w-[1px] bg-emerald-100 mx-1" />

                        {/* ── PROFILE ── */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => { setIsProfileOpen(v => !v); setIsNotifOpen(false); }}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 group ${isProfileOpen ? 'bg-emerald-800 shadow-lg shadow-emerald-900/20' : 'hover:bg-emerald-800 hover:shadow-md hover:shadow-emerald-900/10'}`}
                            >
                                <div className="relative shrink-0 transition-transform active:scale-90 group-hover:scale-105">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-8 h-8 rounded-lg bg-emerald-50 border-2 border-white/20 shadow-sm" alt="avatar" />
                                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 border-2 border-white rounded-full animate-pulse" />
                                </div>
                                <div className="text-left hidden sm:block leading-none">
                                    <p className={`text-[11px] font-black uppercase transition-colors ${isProfileOpen ? 'text-white' : 'text-slate-800 group-hover:text-white'}`}>admin</p>
                                    <p className={`text-[9px] font-bold tracking-widest mt-0.5 uppercase transition-colors ${isProfileOpen ? 'text-emerald-200' : 'text-emerald-600 group-hover:text-emerald-300'}`}>Super Admin</p>
                                </div>
                                <ChevronDown size={13} className={`transition-all duration-200 ${isProfileOpen ? 'rotate-180 text-emerald-200' : 'text-slate-400 group-hover:text-emerald-200'}`} />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-emerald-100/30 overflow-hidden z-50"
                                    >
                                        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 p-4 text-white">
                                            <div className="flex items-center gap-3">
                                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-10 h-10 rounded-xl border-2 border-white/30" alt="avatar" />
                                                <div className="flex-1">
                                                    <p className="text-[13px] font-black uppercase">admin</p>
                                                    <p className="text-[10px] font-bold opacity-80 tracking-wide">SUPER ADMIN</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-4 py-3 border-b border-slate-100/50">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Signed in as</p>
                                            <p className="text-[12px] font-bold text-slate-700">admin@klinik.ai</p>
                                        </div>
                                        <div className="py-2 px-2">
                                            {profileMenuItems.map((item, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={item.action}
                                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[12px] font-bold transition-all ${item.color ? 'text-red-600 hover:bg-red-50' : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'}`}
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

                {/* ── CONTENT ──────────────────────────────────────────────── */}
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

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* ── SYNC CONFIRMATION MODAL ─────────────────────────── */}
<AnimatePresence>
    {showSyncModal && (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                onClick={() => setShowSyncModal(false)}
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            >
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-emerald-100">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-6 py-4 flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                            <Database size={18} className="text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-white uppercase tracking-wide">Sinkronisasi AI DATA</p>
                            <p className="text-[10px] text-emerald-200 font-bold">Knowledge Base Update</p>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-5 space-y-4">
                        {/* Warning box */}
                        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-black text-amber-700 uppercase tracking-wide">Perhatian</p>
                                <p className="text-xs text-amber-600 font-medium mt-0.5">
                                    Proses memakan waktu <span className="font-black">15–30 detik</span>. Jangan tutup atau refresh halaman ini.
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-slate-600 leading-relaxed">
                            Sistem akan memperbarui seluruh basis pengetahuan AI dari database klinik. Lanjutkan proses sinkronisasi?
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-5 flex gap-3">
                        <button
                            onClick={() => setShowSyncModal(false)}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all"
                        >
                            Batal
                        </button>
                        <button
                            onClick={executeSyncAI}
                            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black uppercase tracking-wide transition-all shadow-lg shadow-emerald-100 active:scale-95"
                        >
                            Ya, Sinkronkan
                        </button>
                    </div>
                </div>
            </motion.div>
        </>
    )}
</AnimatePresence>
            {/* ── SYNC RESULT MODAL ──────────────────────────────────── */}
            <AnimatePresence>
                {syncResult && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                            onClick={() => setSyncResult(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
                        >
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-emerald-100">

                                {/* Header */}
                                <div className={`px-6 py-4 flex items-center gap-3 ${syncResult.success
                                        ? 'bg-gradient-to-r from-emerald-700 to-emerald-600'
                                        : 'bg-gradient-to-r from-red-600 to-red-500'
                                    }`}>
                                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                                        <Database size={18} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white uppercase tracking-wide">
                                            {syncResult.success ? 'Sinkronisasi Berhasil' : 'Sinkronisasi Gagal'}
                                        </p>
                                        <p className="text-[10px] text-white/70 font-bold">
                                            Knowledge Base Update
                                        </p>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="px-6 py-5">
                                    <div className={`flex items-start gap-3 rounded-xl p-4 border ${syncResult.success
                                            ? 'bg-emerald-50 border-emerald-200'
                                            : 'bg-red-50 border-red-200'
                                        }`}>
                                        {/* Icon */}
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${syncResult.success ? 'bg-emerald-100' : 'bg-red-100'
                                            }`}>
                                            {syncResult.success
                                                ? <CheckCheck size={16} className="text-emerald-600" />
                                                : <AlertCircle size={16} className="text-red-500" />
                                            }
                                        </div>
                                        <p className={`text-sm font-medium leading-relaxed ${syncResult.success ? 'text-emerald-700' : 'text-red-600'
                                            }`}>
                                            {syncResult.message}
                                        </p>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="px-6 pb-5">
                                    <button
                                        onClick={() => setSyncResult(null)}
                                        className={`w-full py-2.5 rounded-xl text-white text-sm font-black uppercase
                                        tracking-wide transition-all shadow-sm active:scale-95
                                        ${syncResult.success
                                                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                                                : 'bg-red-500 hover:bg-red-600 shadow-red-200'
                                            }`}
                                    >
                                        Oke, Tutup
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}