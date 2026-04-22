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
    ChevronRight, ChevronDown, Sparkles, UserCircle, Shield,
    Lock, CheckCheck, CalendarClock, UserPlus, AlertCircle,
    BarChart,
    MessageSquare
} from 'lucide-react';

// ─── Dummy notifikasi (ganti dengan data dari API) ──────────────────────────
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
    const [isLogoutOpen, setIsLogoutOpen]         = useState(false);
    const [isSyncing, setIsSyncing]               = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthorized, setIsAuthorized]         = useState(false);

    // ── Profile dropdown
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // ── Notifikasi dropdown
    const [isNotifOpen, setIsNotifOpen]     = useState(false);
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
    const notifRef = useRef<HTMLDivElement>(null);
    const unreadCount = notifications.filter(n => !n.read).length;

    const pathname = usePathname();
    const router   = useRouter();

    // 1. PROTEKSI RUTE & SESI
    useEffect(() => {
        const token = localStorage.getItem('token') || Cookies.get('token');
        const role  = localStorage.getItem('user_role') || Cookies.get('role');
        if (!token) {
            router.push('/login');
        } else if (role?.toLowerCase() !== 'admin') {
            alert('Akses Terbatas untuk Admin!');
            router.push('/');
        } else {
            setIsAuthorized(true);
        }
    }, [pathname, router]);

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

    // 4. LOGOUT
    const handleLogout = () => {
        localStorage.clear();
        Cookies.remove('token');
        Cookies.remove('role');
        window.location.href = '/login';
    };

    // 5. SYNC AI
    const handleSyncAI = async () => {
        if (!confirm('Sinkronisasi database AI?')) return;
        setIsSyncing(true);
        try {
            await api.post('/chatbot/ingest');
            alert('✅ AI Knowledge Updated!');
        } catch { alert('❌ Sync Failed'); }
        finally { setIsSyncing(false); }
    };

    // 6. Tandai semua notifikasi sudah dibaca
    const markAllRead = () =>
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    // 7. Tandai satu notifikasi sudah dibaca
    const markRead = (id: number) =>
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

    const navItems = [
        { name: 'Dashboard',        href: '/admin',              icon: <LayoutDashboard size={16} />, color: 'text-emerald-600' },
        { name: 'Reservations',     href: '/admin/appointments', icon: <CalendarCheck2 size={16} />,  color: 'text-teal-600'    },
        { name: 'Daftar Pasien',    href: '/admin/patients',     icon: <Users2 size={16} />,          color: 'text-green-600'   },
        { name: 'Manajemen Dokter', href: '/admin/doctors',      icon: <UserRoundCog size={16} />,    color: 'text-cyan-600'    },
        { name: 'AI Data',          href: '/admin/schedules',    icon: <MessageSquare size={16} />,   color: 'text-green-600' },
        { name: 'AI Knowledge',     href: '/admin/knowledge',    icon: <BrainCircuit size={16} />,    color: 'text-teal-600'    },
        { name: 'Layanan Klinik',   href: '/admin/services',     icon: <Stethoscope size={16} />,     color: 'text-green-600'   },
        { name: 'Pengaturan',       href: '/admin/settings',     icon: <Settings2 size={16} />,       color: 'text-slate-600'   },
    ];

    const profileMenuItems = [
        { name: 'View Profile',   icon: <UserCircle size={16} />, action: () => { setIsProfileOpen(false); router.push('/admin/profile'); } },
        { name: 'Change Account', icon: <Shield size={16} />,     action: () => { setIsProfileOpen(false); router.push('/admin/change-account'); } },
        { name: 'Sign Out',       icon: <LogOut size={16} />,     action: handleLogout, color: 'text-red-600' },
    ];

    if (!isAuthorized) return (
        <div className="h-screen w-screen bg-white flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-emerald-600" size={32} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Checking Security...</p>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[#F0F9F7] text-[#1E293B] font-sans">

            {/* ═══════════════════ SIDEBAR ═══════════════════════════════════ */}
            <aside className={`fixed lg:sticky lg:top-0 z-50 w-60 h-screen bg-white border-r border-emerald-50/50 shadow-sm transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-5 flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-emerald-700 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-200 font-black italic text-xs">K</div>
                        <h1 className="text-base font-black tracking-tighter text-slate-800">Klinik.<span className="text-emerald-700">AI</span></h1>
                    </div>
                    <div className="mx-3 mb-4 p-3 bg-emerald-50/40 rounded-xl border border-emerald-100/50">
                        <p className="text-[10px] font-black text-emerald-900 uppercase leading-none">Nauli Dental Care</p>
                        <p className="text-[9px] text-emerald-600 font-bold truncate mt-1 italic opacity-70">Jl. Balige No. 12, Toba</p>
                    </div>
                    <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-3 mb-2 opacity-60">Admin System</p>
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href} className="block group">
                                    <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all relative ${isActive ? 'bg-emerald-700 text-white shadow-md shadow-emerald-200' : 'text-slate-600 hover:bg-emerald-50/50 hover:text-emerald-700'}`}>
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${isActive ? 'bg-white/20' : 'bg-transparent'}`}>
                                            <span className={isActive ? 'text-white' : item.color}>{item.icon}</span>
                                        </div>
                                        <span className={`text-[12px] font-bold tracking-tight ${isActive ? 'text-white' : ''}`}>{item.name}</span>
                                        {isActive && <motion.div layoutId="nav-line" className="absolute -left-1 w-1 h-4 bg-emerald-700 rounded-full" />}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="p-3 border-t border-slate-50">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-600 text-[12px] font-bold transition-all group rounded-xl hover:bg-red-50">
                            <LogOut size={16} className="group-hover:translate-x-1 transition-transform" /> <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* ═══════════════════ MAIN CONTENT ══════════════════════════════ */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">

                {/* ────────────────── HEADER ────────────────────────────────── */}
                <header className="h-14 bg-white/80 backdrop-blur-md border-b border-emerald-50/50 px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 bg-emerald-50 rounded-lg text-emerald-600">
                            <Menu size={18} />
                        </button>
                        <h2 className="text-[12px] font-black text-slate-800 tracking-widest leading-none uppercase italic border-l-2 border-emerald-600 pl-3">
                            {navItems.find(i => i.href === pathname)?.name || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <div className="relative hidden md:block group mr-1">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300 group-focus-within:text-emerald-500 transition-colors" />
                            <input type="text" placeholder="Global search..." className="pl-9 pr-4 py-1.5 bg-emerald-50/50 border border-transparent rounded-full text-[11px] w-52 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all" />
                        </div>

                        {/* Sync AI */}
                        <button onClick={handleSyncAI} disabled={isSyncing} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all ${isSyncing ? 'bg-slate-100 text-slate-400' : 'bg-white text-emerald-600 border-emerald-100 hover:bg-emerald-50'}`}>
                            <Database size={14} className={isSyncing ? 'animate-spin' : ''} /> {isSyncing ? 'SYNC...' : 'SYNC AI'}
                        </button>

                        <div className="h-5 w-[1px] bg-emerald-100 mx-1" />

                        {/* ════ IKON 1 — NOTIFIKASI ════════════════════════ */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => {
                                    setIsNotifOpen(v => !v);
                                    setIsProfileOpen(false);   // tutup profile jika terbuka
                                }}
                                title="Notifikasi"
                                className={`relative p-2 rounded-lg transition-all duration-200 ${
                                    isNotifOpen
                                        ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/20'
                                        : 'text-slate-400 hover:text-white hover:bg-emerald-800 hover:shadow-md hover:shadow-emerald-900/10'
                                }`}
                            >
                                <BellRing size={16} />
                                {/* Badge jumlah unread */}
                                <AnimatePresence>
                                    {unreadCount > 0 && (
                                        <motion.span
                                            key="badge"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white leading-none"
                                        >
                                            {unreadCount}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>

                            {/* Dropdown Notifikasi */}
                            <AnimatePresence>
                                {isNotifOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-emerald-100/30 overflow-hidden z-50"
                                    >
                                        {/* Header */}
                                        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-4 py-3 flex items-center justify-between">
                                            <div>
                                                <p className="text-[12px] font-black text-white uppercase tracking-wide">Notifikasi</p>
                                                <p className="text-[9px] text-emerald-200 font-bold mt-0.5">{unreadCount} belum dibaca</p>
                                            </div>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={markAllRead}
                                                    className="flex items-center gap-1 px-2 py-1 bg-white/15 hover:bg-white/25 text-white text-[9px] font-black rounded-lg transition-all uppercase tracking-wide"
                                                >
                                                    <CheckCheck size={11} /> Tandai semua
                                                </button>
                                            )}
                                        </div>

                                        {/* List */}
                                        <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="py-8 text-center text-slate-400 text-[11px] font-bold">
                                                    Tidak ada notifikasi
                                                </div>
                                            ) : notifications.map(notif => (
                                                <button
                                                    key={notif.id}
                                                    onClick={() => markRead(notif.id)}
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
                                                            {!notif.read && (
                                                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{notif.desc}</p>
                                                        <p className="text-[9px] text-slate-400 mt-1 font-bold">{notif.time}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Footer */}
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

                        {/* ════ PROFILE BUTTON ════════════════════════════ */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => {
                                    setIsProfileOpen(v => !v);
                                    setIsNotifOpen(false);   // tutup notif jika terbuka
                                }}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 group ${
                                    isProfileOpen
                                        ? 'bg-emerald-800 shadow-lg shadow-emerald-900/20'
                                        : 'hover:bg-emerald-800 hover:shadow-md hover:shadow-emerald-900/10'
                                }`}
                            >
                                {/* Avatar */}
                                <div className="relative shrink-0 transition-transform active:scale-90 group-hover:scale-105">
                                    <img
                                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                        className="w-8 h-8 rounded-lg bg-emerald-50 border-2 border-white/20 shadow-sm"
                                        alt="avatar"
                                    />
                                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 border-2 border-white rounded-full animate-pulse" />
                                </div>
                                {/* Teks */}
                                <div className="text-left hidden sm:block leading-none">
                                    <p className={`text-[11px] font-black uppercase transition-colors ${isProfileOpen ? 'text-white' : 'text-slate-800 group-hover:text-white'}`}>
                                        admin
                                    </p>
                                    <p className={`text-[9px] font-bold tracking-widest mt-0.5 uppercase transition-colors ${isProfileOpen ? 'text-emerald-200' : 'text-emerald-600 group-hover:text-emerald-300'}`}>
                                        Super Admin
                                    </p>
                                </div>
                                {/* Chevron */}
                                <ChevronDown
                                    size={13}
                                    className={`transition-all duration-200 ${isProfileOpen ? 'rotate-180 text-emerald-200' : 'text-slate-400 group-hover:text-emerald-200'}`}
                                />
                            </button>

                            {/* Dropdown Profile */}
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

                {/* ────────────────── CONTENT ───────────────────────────────── */}
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
        </div>
    );
}