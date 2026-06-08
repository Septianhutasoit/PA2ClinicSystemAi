'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/services/api';
import Link from 'next/link';
import Image from 'next/image';
import {
    LayoutDashboard, Users, Calendar,
    FileText, LogOut, Stethoscope,
    Menu, X, BellRing, User, ChevronDown,
    Activity, Loader2, Moon, Sun,
    CheckCheck, CalendarClock, UserPlus, AlertCircle, Shield, UserCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [doctorName, setDoctorName] = useState('Dokter');

    // ── Profile dropdown
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // ── Notifikasi dropdown
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const notifRef = useRef<HTMLDivElement>(null);

    // ── Dark mode
    const [isDarkMode, setIsDarkMode] = useState(false);

    // 1. AUTH CHECK
    useEffect(() => {
        const token = localStorage.getItem('token') || Cookies.get('token');
        const role = localStorage.getItem('user_role') || Cookies.get('role');
        const name = localStorage.getItem('user_name') || 'Dokter';
        if (!token || role?.toLowerCase() !== 'doctor') {
            router.push('/login');
        } else {
            setIsAuthorized(true);
            setDoctorName(name);
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

    //notif dinamisnya
    const fetchNotifications = async () => {
        try {
            const res = await api.get('/clinic/doctor/notifications');
            const dynamic = res.data.map((appt: any) => ({
                id: appt.id,
                icon: <CalendarClock size={14} />,
                color: 'text-teal-600 bg-teal-50',
                title: 'Pasien Menunggu',
                desc: `${appt.patient_name} — menunggu di antrean`,
                time: new Date(appt.appointment_date).toLocaleTimeString('id-ID', {
                    hour: '2-digit', minute: '2-digit'
                }) + ' WIB',
                read: false,
            }));
            setNotifications(dynamic);
            setUnreadCount(dynamic.length);
        } catch {
            // silent — notifikasi tetap kosong
        }
    };

    // ✅ TAMBAH — useEffect memanggil fetch saat authorized
    useEffect(() => {
        if (!isAuthorized) return;
        fetchNotifications();
        const timer = setInterval(fetchNotifications, 60000); // refresh tiap 1 menit
        return () => clearInterval(timer);
    }, [isAuthorized]);

    // 4. LOGOUT
    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('role');
        localStorage.clear();
        router.push('/login');
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const markRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/doctor' },
        { icon: Calendar, label: 'Jadwal Praktek', href: '/doctor/schedule' },
        { icon: Users, label: 'Antrian Pasien', href: '/doctor/queue' },
        { icon: FileText, label: 'Rekam Medis', href: '/doctor/medical-records' },
        { icon: Activity, label: 'Laporan Medis', href: '/doctor/dashboard' },
    ];

    if (!isAuthorized) return (
        <div className="h-screen w-screen bg-white flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <Stethoscope className="text-emerald-600 animate-pulse" size={28} />
            </div>
            <Loader2 className="animate-spin text-emerald-400" size={24} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Memverifikasi Akses Dokter...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F0F9F7] flex font-sans">

            {/* ═══════════════════ SIDEBAR ═══════════════════════════════════ */}
            <aside className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-emerald-50/50 shadow-sm flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-[240px]' : 'w-[72px]'}`}>

                {/* Logo */}
                <div className={`border-b border-emerald-50/50 shrink-0 flex items-center transition-all duration-150 ${isSidebarOpen ? 'px-4 py-5 gap-3 justify-start' : 'px-2 py-4 justify-center'
                    }`}>
                    <div className={`rounded-2xl overflow-hidden flex items-center justify-center bg-white ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-200/60 p-1 shrink-0 transition-all duration-150 ${isSidebarOpen ? 'w-11 h-11' : 'w-12 h-12'
                        }`}>
                        <Image
                            src="/images/Logo.png"
                            alt="Nauli Dental Logo"
                            width={44}
                            height={44}
                            className="object-contain w-full h-full"
                        />
                    </div>
                    <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.15 }}
                                className="overflow-hidden"
                            >
                                <p className="text-base font-black tracking-tighter text-slate-800 leading-none whitespace-nowrap">
                                    Nauli <span className="text-emerald-700">Dental</span>
                                </p>
                                <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest mt-0.5 whitespace-nowrap">
                                    Doc System
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Doctor Badge */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mx-3 mt-4 mb-2 p-3 bg-emerald-50/40 rounded-xl border border-emerald-100/50 overflow-hidden"
                        >
                            <p className="text-[10px] font-black text-emerald-900 uppercase leading-none">Nauli Dental Care</p>
                            <p className="text-[9px] text-emerald-600 font-bold truncate mt-1 italic opacity-70">{doctorName}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation */}
                <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto py-2">
                    {isSidebarOpen && (
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-3 mb-2 opacity-60">Doc Menu</p>
                    )}
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href} title={!isSidebarOpen ? item.label : undefined}>
                                <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all relative group ${isActive
                                        ? 'bg-emerald-700 text-white shadow-md shadow-emerald-200'
                                        : 'text-slate-600 hover:bg-emerald-50/50 hover:text-emerald-700'
                                    }`}>
                                    {/* Active indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="doc-sidebar-line"
                                            className="absolute -left-1 w-1 h-4 bg-emerald-700 rounded-full"
                                        />
                                    )}

                                    {/* Ikon */}
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${isActive ? 'bg-white/20' : 'bg-transparent'
                                        }`}>
                                        <item.icon
                                            size={16}
                                            className={isActive ? 'text-white' : 'text-emerald-600'}
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
                                        <div className="absolute left-full ml-3 px-3 py-1.5 bg-emerald-900 text-white text-[11px] font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50 shadow-lg">
                                            {item.label}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-3 border-t border-emerald-50/50 shrink-0">
                    <button
                        onClick={handleLogout}
                        title={!isSidebarOpen ? 'Logout' : undefined}
                        className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-600 hover:bg-red-50 text-[12px] font-bold transition-all group rounded-xl"
                    >
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                            <LogOut size={15} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* ═══════════════════ MAIN ══════════════════════════════════════ */}
            <main className={`flex-1 flex flex-col min-w-0 h-screen overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'ml-[240px]' : 'ml-[72px]'}`}>

                {/* ────────────────── HEADER ────────────────────────────────── */}
                <header className="h-14 bg-white/80 backdrop-blur-md border-b border-emerald-50/50 px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">

                    {/* Kiri: toggle sidebar + judul halaman */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(v => !v)}
                            className="hidden lg:flex p-2 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
                        >
                            <Menu size={18} />
                        </button>
                        <h2 className="text-[12px] font-black text-slate-800 tracking-widest leading-none uppercase italic border-l-2 border-emerald-600 pl-3">
                            {menuItems.find(i => i.href === pathname)?.label || 'Dashboard'}
                        </h2>
                    </div>

                    {/* Kanan: ikon + profile */}
                    <div className="flex items-center gap-2">

                        {/* ════ IKON 1 — NOTIFIKASI ════════════════════════ */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => { setIsNotifOpen(v => !v); setIsProfileOpen(false); }}
                                title="Notifikasi"
                                className={`relative p-2 rounded-lg transition-all duration-200 ${isNotifOpen
                                        ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/20'
                                        : 'text-slate-400 hover:text-white hover:bg-emerald-800 hover:shadow-md hover:shadow-emerald-900/10'
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
                                        <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="py-10 text-center space-y-2">
                                                    <BellRing size={22} className="mx-auto text-slate-200" />
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        Tidak ada pasien menunggu
                                                    </p>
                                                </div>
                                            ) : (
                                                notifications.map(notif => (
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
                                                                <p className={`text-[11px] font-black truncate ${!notif.read ? 'text-slate-800' : 'text-slate-500'}`}>{notif.title}</p>
                                                                {!notif.read && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />}
                                                            </div>
                                                            <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{notif.desc}</p>
                                                            <p className="text-[9px] text-slate-400 mt-1 font-bold">{notif.time}</p>
                                                        </div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
                                            <button
                                                onClick={() => setIsNotifOpen(false)}
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
                                onClick={() => { setIsProfileOpen(v => !v); setIsNotifOpen(false); }}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 group ${isProfileOpen
                                        ? 'bg-emerald-800 shadow-lg shadow-emerald-900/20'
                                        : 'hover:bg-emerald-800 hover:shadow-md hover:shadow-emerald-900/10'
                                    }`}
                            >
                                {/* Avatar ikon dokter */}
                                <div className="relative shrink-0 transition-transform active:scale-90 group-hover:scale-105">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-700 border-2 border-white/20 shadow-sm flex items-center justify-center text-white font-black text-sm">
                                        {doctorName.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 border-2 border-white rounded-full animate-pulse" />
                                </div>

                                {/* Teks */}
                                <div className="text-left hidden sm:block leading-none">
                                    <p className={`text-[11px] font-black uppercase transition-colors truncate max-w-[90px] ${isProfileOpen ? 'text-white' : 'text-slate-800 group-hover:text-white'}`}>
                                        {doctorName}
                                    </p>
                                    <p className={`text-[9px] font-bold tracking-widest mt-0.5 uppercase transition-colors ${isProfileOpen ? 'text-emerald-200' : 'text-emerald-600 group-hover:text-emerald-300'}`}>
                                        Dokter
                                    </p>
                                </div>

                                {/* Chevron */}
                                <ChevronDown size={13} className={`transition-all duration-200 ${isProfileOpen ? 'rotate-180 text-emerald-200' : 'text-slate-400 group-hover:text-emerald-200'}`} />
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
                                        {/* Header gradient */}
                                        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 p-4 text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border-2 border-white/30 text-white font-black text-lg">
                                                    {doctorName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[13px] font-black uppercase">{doctorName}</p>
                                                    <p className="text-[10px] font-bold opacity-80 tracking-wide">DOKTER SPESIALIS</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Email/info */}
                                        <div className="px-4 py-3 border-b border-slate-100/50">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Signed in as</p>
                                            <p className="text-[12px] font-bold text-slate-700">dokter@klinik.ai</p>
                                        </div>

                                        {/* Menu items */}
                                        <div className="py-2 px-2">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[12px] font-bold text-red-600 hover:bg-red-50 transition-all"
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