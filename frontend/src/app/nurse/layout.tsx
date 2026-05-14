'use client';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import {
    LayoutDashboard,
    ClipboardList,
    Users2,
    LogOut,
    Menu,
    Loader2,
    Stethoscope,
    HeartPulse,
    BellRing,
    ChevronDown,
    Activity,
    Moon,
    Sun,
    CheckCheck,
    CalendarClock,
    UserPlus,
    AlertCircle,
    UserCircle,
    Shield,
} from 'lucide-react';

// ─── Dummy notifikasi perawat ───────────────────────────────────────────────
const INITIAL_NOTIFICATIONS = [
    { id: 1, icon: <CalendarClock size={14} />, color: 'text-teal-600 bg-teal-50', title: 'Pasien Baru', desc: 'Budi Santoso baru saja mendaftar', time: '5 mnt lalu', read: false },
    { id: 2, icon: <UserPlus size={14} />, color: 'text-emerald-600 bg-emerald-50', title: 'Antrian Hari Ini', desc: '8 pasien menunggu konfirmasi', time: '20 mnt lalu', read: false },
    { id: 3, icon: <AlertCircle size={14} />, color: 'text-amber-600 bg-amber-50', title: 'Data Belum Lengkap', desc: 'Rekam medis Siti belum diisi', time: '1 jam lalu', read: false },
    { id: 4, icon: <CheckCheck size={14} />, color: 'text-slate-500 bg-slate-100', title: 'Konfirmasi Selesai', desc: '12 pasien berhasil dikonfirmasi hari ini', time: '2 jam lalu', read: true },
];

export default function NurseLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [nurseName, setNurseName] = useState('Perawat');

    // ── Profile dropdown
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // ── Notifikasi dropdown
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
    const notifRef = useRef<HTMLDivElement>(null);
    const unreadCount = notifications.filter(n => !n.read).length;

    // ── Dark mode
    const [isDarkMode, setIsDarkMode] = useState(false);

    // 1. AUTH CHECK
    useEffect(() => {
        const token = localStorage.getItem('token') || Cookies.get('token');
        const role = localStorage.getItem('user_role') || Cookies.get('role');
        const name = localStorage.getItem('user_name') || 'Perawat';
        if (!token || role?.toLowerCase() !== 'nurse') {
            router.push('/login');
        } else {
            setIsAuthorized(true);
            setNurseName(name);
        }
    }, [router]);

    // 2. CLOSE DROPDOWNS ON OUTSIDE CLICK
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setIsProfileOpen(false);
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) setIsNotifOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // 3. DARK MODE
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    // 4. LOGOUT
    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('role');
        localStorage.clear();
        router.push('/login');
    };

    const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    const markRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/nurse' },
        { icon: ClipboardList, label: 'Antrian Hari Ini', href: '/nurse/queue' },
        { icon: Users2, label: 'Daftar Pasien', href: '/nurse/patients' },
        { icon: Stethoscope, label: 'Layanan Klinik', href: '/nurse/services' },
        { icon: Activity, label: 'Catatan Medis', href: '/nurse/records' },
        { icon: UserCircle, label: 'Profil Saya', href: '/nurse/profile' },
    ];

    // ── Loading gate
    if (!isAuthorized) return (
        <div className="h-screen w-screen bg-white flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center">
                <HeartPulse className="text-teal-500 animate-pulse" size={28} />
            </div>
            <Loader2 className="animate-spin text-teal-400" size={24} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Memverifikasi Akses Perawat...
            </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F0FAF5] flex font-sans">

            {/* ═══════════════════ SIDEBAR ═══════════════════════════════════ */}
            <aside className={`
                fixed inset-y-0 left-0 z-50
                bg-white border-r border-teal-50/50 shadow-sm
                flex flex-col transition-all duration-300
                ${isSidebarOpen ? 'w-[240px]' : 'w-[72px]'}
            `}>

                {/* Logo */}
                <div className="flex items-center gap-3 px-4 py-5 border-b border-teal-50/50 shrink-0">
                    <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center
                                    text-white shadow-lg shadow-teal-200 shrink-0">
                        <HeartPulse size={16} />
                    </div>
                    <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={{ duration: 0.15 }}
                            >
                                <p className="text-base font-black tracking-tighter text-slate-800 leading-none">
                                    Klinik.<span className="text-teal-600">AI</span>
                                </p>
                                <p className="text-[9px] text-teal-600 font-bold uppercase tracking-widest mt-0.5">
                                    Nurse System
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Nurse Badge */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mx-3 mt-4 mb-2 p-3 bg-teal-50/40 rounded-xl border border-teal-100/50 overflow-hidden"
                        >
                            <p className="text-[10px] font-black text-teal-900 uppercase leading-none">
                                Nauli Dental Care
                            </p>
                            <p className="text-[9px] text-teal-600 font-bold truncate mt-1 italic opacity-70">
                                {nurseName}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation */}
                <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto py-2">
                    {isSidebarOpen && (
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-3 mb-2 opacity-60">
                            Nurse Menu
                        </p>
                    )}
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href} title={!isSidebarOpen ? item.label : undefined}>
                                <div className={`
                                    flex items-center gap-2.5 px-3 py-2 rounded-xl
                                    transition-all relative group
                                    ${isActive
                                        ? 'bg-teal-700 text-white shadow-md shadow-teal-200'
                                        : 'text-slate-600 hover:bg-teal-50/50 hover:text-teal-700'
                                    }
                                `}>
                                    {/* Active indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nurse-sidebar-line"
                                            className="absolute -left-1 w-1 h-4 bg-teal-700 rounded-full"
                                        />
                                    )}

                                    {/* Ikon */}
                                    <div className={`
                                        w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all
                                        ${isActive ? 'bg-white/20' : 'bg-transparent'}
                                    `}>
                                        <item.icon
                                            size={16}
                                            className={isActive ? 'text-white' : 'text-teal-600'}
                                        />
                                    </div>

                                    {/* Label */}
                                    <AnimatePresence>
                                        {isSidebarOpen && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={`text-[12px] font-bold tracking-tight truncate ${isActive ? 'text-white' : ''}`}
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>

                                    {/* Tooltip saat sidebar kecil */}
                                    {!isSidebarOpen && (
                                        <div className="absolute left-full ml-3 px-3 py-1.5 bg-teal-900 text-white
                                                        text-[11px] font-bold rounded-lg opacity-0 group-hover:opacity-100
                                                        pointer-events-none whitespace-nowrap transition-opacity z-50 shadow-lg">
                                            {item.label}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-3 border-t border-teal-50/50 shrink-0">
                    <button
                        onClick={handleLogout}
                        title={!isSidebarOpen ? 'Logout' : undefined}
                        className="w-full flex items-center gap-3 px-3 py-2 text-slate-400
                                   hover:text-red-600 hover:bg-red-50 text-[12px] font-bold
                                   transition-all group rounded-xl"
                    >
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                            <LogOut size={15} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* ═══════════════════ MAIN ══════════════════════════════════════ */}
            <main className={`
                flex-1 flex flex-col min-w-0 h-screen overflow-y-auto
                transition-all duration-300
                ${isSidebarOpen ? 'ml-[240px]' : 'ml-[72px]'}
            `}>

                {/* ────────────────── HEADER ────────────────────────────────── */}
                <header className="h-14 bg-white/80 backdrop-blur-md border-b border-teal-50/50
                                   px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">

                    {/* Kiri: toggle sidebar + judul */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(v => !v)}
                            className="hidden lg:flex p-2 text-slate-400 hover:text-teal-700
                                       hover:bg-teal-50 rounded-lg transition-all"
                        >
                            <Menu size={18} />
                        </button>
                        <h2 className="text-[12px] font-black text-slate-800 tracking-widest
                                       leading-none uppercase italic border-l-2 border-teal-600 pl-3">
                            {menuItems.find(i => i.href === pathname)?.label || 'Dashboard'}
                        </h2>
                    </div>

                    {/* Kanan */}
                    <div className="flex items-center gap-2">

                        {/* ════ NOTIFIKASI ═════════════════════════════════ */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => { setIsNotifOpen(v => !v); setIsProfileOpen(false); }}
                                className={`relative p-2 rounded-lg transition-all duration-200
                                    ${isNotifOpen
                                        ? 'bg-teal-800 text-white shadow-md shadow-teal-900/20'
                                        : 'text-slate-400 hover:text-white hover:bg-teal-800 hover:shadow-md'
                                    }`}
                            >
                                <BellRing size={16} />
                                <AnimatePresence>
                                    {unreadCount > 0 && (
                                        <motion.span
                                            key="badge"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5
                                                       bg-red-500 text-white text-[9px] font-black rounded-full
                                                       flex items-center justify-center border-2 border-white leading-none"
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
                                        className="absolute right-0 mt-2 w-80 bg-white rounded-2xl
                                                   shadow-xl border border-teal-100/30 overflow-hidden z-50"
                                    >
                                        <div className="bg-gradient-to-r from-teal-700 to-teal-600 px-4 py-3
                                                        flex items-center justify-between">
                                            <div>
                                                <p className="text-[12px] font-black text-white uppercase tracking-wide">
                                                    Notifikasi
                                                </p>
                                                <p className="text-[9px] text-teal-200 font-bold mt-0.5">
                                                    {unreadCount} belum dibaca
                                                </p>
                                            </div>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={markAllRead}
                                                    className="flex items-center gap-1 px-2 py-1 bg-white/15
                                                               hover:bg-white/25 text-white text-[9px] font-black
                                                               rounded-lg transition-all uppercase tracking-wide"
                                                >
                                                    <CheckCheck size={11} /> Tandai semua
                                                </button>
                                            )}
                                        </div>
                                        <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                                            {notifications.map(notif => (
                                                <button
                                                    key={notif.id}
                                                    onClick={() => markRead(notif.id)}
                                                    className={`w-full flex items-start gap-3 px-4 py-3 text-left
                                                        transition-all hover:bg-teal-50/60
                                                        ${!notif.read ? 'bg-teal-50/30' : ''}`}
                                                >
                                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center
                                                                    shrink-0 mt-0.5 ${notif.color}`}>
                                                        {notif.icon}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className={`text-[11px] font-black truncate
                                                                ${!notif.read ? 'text-slate-800' : 'text-slate-500'}`}>
                                                                {notif.title}
                                                            </p>
                                                            {!notif.read && (
                                                                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full shrink-0" />
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                                                            {notif.desc}
                                                        </p>
                                                        <p className="text-[9px] text-slate-400 mt-1 font-bold">
                                                            {notif.time}
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
                                            <button
                                                onClick={() => setIsNotifOpen(false)}
                                                className="w-full text-[10px] font-black text-teal-700
                                                           hover:text-teal-900 uppercase tracking-widest transition-colors"
                                            >
                                                Lihat semua notifikasi →
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ════ DARK MODE ══════════════════════════════════ */}
                        <button
                            onClick={() => setIsDarkMode(v => !v)}
                            title={isDarkMode ? 'Matikan Dark Mode' : 'Aktifkan Dark Mode'}
                            className={`relative p-2 rounded-lg transition-all duration-200 overflow-hidden
                                ${isDarkMode
                                    ? 'bg-teal-800 text-white shadow-md shadow-teal-900/20'
                                    : 'text-slate-400 hover:text-white hover:bg-teal-800 hover:shadow-md'
                                }`}
                        >
                            <AnimatePresence mode="wait">
                                {isDarkMode ? (
                                    <motion.span key="sun"
                                        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex"
                                    >
                                        <Sun size={16} />
                                    </motion.span>
                                ) : (
                                    <motion.span key="moon"
                                        initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                        exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex"
                                    >
                                        <Moon size={16} />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>

                        <div className="h-5 w-[1px] bg-teal-100 mx-1" />

                        {/* ════ PROFILE BUTTON ════════════════════════════ */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => { setIsProfileOpen(v => !v); setIsNotifOpen(false); }}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg
                                            transition-all duration-200 group
                                    ${isProfileOpen
                                        ? 'bg-teal-800 shadow-lg shadow-teal-900/20'
                                        : 'hover:bg-teal-800 hover:shadow-md hover:shadow-teal-900/10'
                                    }`}
                            >
                                {/* Avatar */}
                                <div className="relative shrink-0 transition-transform active:scale-90 group-hover:scale-105">
                                    <div className="w-8 h-8 rounded-lg bg-teal-700 border-2 border-white/20
                                                    shadow-sm flex items-center justify-center">
                                        <HeartPulse size={15} className="text-white" />
                                    </div>
                                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400
                                                     border-2 border-white rounded-full animate-pulse" />
                                </div>

                                {/* Teks */}
                                <div className="text-left hidden sm:block leading-none">
                                    <p className={`text-[11px] font-black uppercase transition-colors truncate max-w-[90px]
                                        ${isProfileOpen ? 'text-white' : 'text-slate-800 group-hover:text-white'}`}>
                                        {nurseName}
                                    </p>
                                    <p className={`text-[9px] font-bold tracking-widest mt-0.5 uppercase transition-colors
                                        ${isProfileOpen ? 'text-teal-200' : 'text-teal-600 group-hover:text-teal-300'}`}>
                                        Perawat
                                    </p>
                                </div>

                                {/* Chevron */}
                                <ChevronDown size={13} className={`transition-all duration-200
                                    ${isProfileOpen
                                        ? 'rotate-180 text-teal-200'
                                        : 'text-slate-400 group-hover:text-teal-200'
                                    }`}
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
                                        className="absolute right-0 mt-2 w-72 bg-white rounded-2xl
                                                   shadow-xl border border-teal-100/30 overflow-hidden z-50"
                                    >
                                        {/* Header gradient */}
                                        <div className="bg-gradient-to-r from-teal-700 to-teal-600 p-4 text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center
                                                                justify-center border-2 border-white/30">
                                                    <HeartPulse size={20} className="text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[13px] font-black uppercase">{nurseName}</p>
                                                    <p className="text-[10px] font-bold opacity-80 tracking-wide">
                                                        PERAWAT KLINIK
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Email / info */}
                                        <div className="px-4 py-3 border-b border-slate-100/50">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">
                                                Signed in as
                                            </p>
                                            <p className="text-[12px] font-bold text-slate-700">
                                                {localStorage.getItem('user_email') || 'perawat@klinik.ai'}
                                            </p>
                                        </div>

                                        {/* Info tambahan */}
                                        <div className="px-4 py-3 border-b border-slate-100/50 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                    Role
                                                </span>
                                                <span className="flex items-center gap-1 text-[10px] font-black
                                                                 text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                                                    <Shield size={9} /> Perawat
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                    Status
                                                </span>
                                                <span className="flex items-center gap-1 text-[10px] font-black
                                                                 text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                                    Online
                                                </span>
                                            </div>
                                        </div>

                                        {/* Menu items */}
                                        <div className="py-2 px-2">
                                            <button
                                                onClick={() => { setIsProfileOpen(false); router.push('/nurse/profile'); }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
                                                           text-[12px] font-bold text-slate-700
                                                           hover:bg-teal-50 hover:text-teal-700 transition-all"
                                            >
                                                <UserCircle size={16} className="text-teal-600" />
                                                Lihat Profil Saya
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
                                                           text-[12px] font-bold text-red-600
                                                           hover:bg-red-50 transition-all"
                                            >
                                                <LogOut size={16} /> Keluar
                                            </button>
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
        </div>
    );
}