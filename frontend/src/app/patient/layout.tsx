'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, ChevronDown, LogOut, Settings, User, Home,
    Menu, X, UserPlus, Building2, UsersRound,
    LayoutDashboard, CalendarCheck, FileText,
    Stethoscope, Users, ClipboardList, Sparkles, Target, HeartPulse
} from 'lucide-react';
import api from '@/services/api';

// ── Tipe Notifikasi ──────────────────────────────────────────────────────────
interface Notification {
    id: number;
    title: string;
    desc: string;
    color?: string;
    time?: string;
}

export default function PatientLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState({ name: '', email: '' });
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const [isQuickOpen, setIsQuickOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    // ── FIX 1: State notifikasi yang sebelumnya hilang ───────────────────────
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const notifRef = useRef<HTMLDivElement>(null);
    const seenNotifIds = useRef<Set<string>>(new Set());

    // 1. PROTEKSI ROLE PASIEN
    useEffect(() => {
        const token = localStorage.getItem('token') || Cookies.get('token');
        const role = localStorage.getItem('user_role') || Cookies.get('role');

        // JIKA TIDAK ADA TOKEN: Jangan di-push ke login! 
        // Biarkan masuk sebagai tamu.
        if (!token || role?.toLowerCase() !== 'patient') {
            setIsAuthorized(true); // Izinkan render halaman
            setUser({ name: 'Tamu', email: '' });
            setLoggedIn(false); // State untuk kontrol UI (tombol masuk vs profile)
            return;
        }

        const fetchUserData = async () => {
            try {
                const res = await api.get('/auth/me');
                setUser({ name: res.data.full_name, email: res.data.email });
                setIsAuthorized(true);
                setLoggedIn(true);
            } catch (err) {
                console.error("Token invalid, treating as guest");
                localStorage.clear();
                Cookies.remove('token');
                setIsAuthorized(true);
                setUser({ name: 'Tamu', email: '' });
                setLoggedIn(false);
            }
        };

        fetchUserData();
    }, [router, pathname]);

    const getInitials = (name: string) => {
        return name
            ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
            : 'U';
    };


    // 2. SCROLL EFFECT
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 80);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 3. LIVE NOTIF — cek setiap 10 detik
    const checkLiveStatus = async () => {
        try {
            const res = await api.get('/clinic/appointments/me');
            const appointments: any[] = res.data;
            if (!appointments?.length) return;

            const newNotifs: Notification[] = [];

            appointments.forEach((appt: any) => {
                // Buat key unik per appointment + status
                // Sehingga notif hanya muncul SEKALI per perubahan status
                const key = `${appt.id}-${appt.status}`;
                if (seenNotifIds.current.has(key)) return;

                // Konfigurasi notif berdasarkan status
                const config: Record<string, { title: string; desc: string; color: string }> = {
                    confirmed: {
                        title: '✅ Reservasi Dikonfirmasi',
                        desc: `Janji dengan ${appt.doctor_name} telah dikonfirmasi.`,
                        color: 'bg-emerald-500',
                    },
                    scheduled: {
                        title: '🔔 GILIRAN ANDA!',
                        desc: `Silakan masuk ke ruangan ${appt.doctor_name} sekarang.`,
                        color: 'bg-blue-500 animate-pulse',
                    },
                    completed: {
                        title: '🩺 Pemeriksaan Selesai',
                        desc: `Rekam medis dari ${appt.doctor_name} telah tersedia.`,
                        color: 'bg-teal-500',
                    },
                    cancelled: {
                        title: '❌ Reservasi Dibatalkan',
                        desc: `Janji dengan ${appt.doctor_name} telah dibatalkan.`,
                        color: 'bg-red-500',
                    },
                };

                const cfg = config[appt.status];
                if (!cfg) return; // pending tidak perlu notif

                newNotifs.push({
                    id: appt.id,
                    title: cfg.title,
                    desc: cfg.desc,
                    color: cfg.color,
                    time: new Date(appt.appointment_date).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    }),
                });
            });

            if (newNotifs.length > 0) {
                // Gabungkan dengan notif lama, batas 10 item
                setNotifications(prev => [...newNotifs, ...prev].slice(0, 10));
                setUnreadCount(prev => prev + newNotifs.length);

                // Tandai sebagai sudah diproses
                newNotifs.forEach(n => {
                    seenNotifIds.current.add(`${n.id}-${appointments.find(a => a.id === n.id)?.status}`);
                });
            }

        } catch { /* silent */ }
    };

    useEffect(() => {
        if (!loggedIn) return;
        checkLiveStatus(); // Langsung cek saat mount
        const timer = setInterval(checkLiveStatus, 10000);
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogout = () => setShowLogoutModal(true);
    const executeLogout = () => {
        setShowLogoutModal(false);
        localStorage.clear();
        Cookies.remove('token', { path: '/' });
        Cookies.remove('role', { path: '/' });
        Cookies.remove('user_role', { path: '/' });
        document.cookie.split(';').forEach(c => {
            document.cookie = c
                .replace(/^ +/, '')
                .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
        });
        router.push('/login');
    };

    const navItems = [
        { name: 'Beranda', href: '/patient/dashboard', icon: Home },
        { name: 'Layanan', href: '/patient/services', icon: Stethoscope },
        { name: 'Nauli Dental', href: '/patient/about', icon: Building2 },
        { name: 'Tim Kami', href: '/patient/doctors', icon: UsersRound },
        { name: 'Visi & Misi', href: '/patient/visiMisi', icon: Target },
        { name: 'Nauli Co', href: '/patient/nauli-co/about', icon: Sparkles },
    ];

    if (!isAuthorized) return null;
    // navbar baru includes
    const isNauliCoArea = pathname.includes('/nauli-co');
    if (isNauliCoArea) {
        return <>{children}</>;
    }

    const isHeroPage = [
        '/patient/dashboard', '/patient/about', '/patient/appointments',
        '/patient/records', '/patient/services', '/patient/visiMisi',
        '/patient/doctors',
    ].some(p => pathname.startsWith(p));

    return (
        <div className="min-h-screen font-sans overflow-x-clip bg-slate-50">

            {/* ══════════════════════════════════════════════════════════════
                NAVBAR
            ══════════════════════════════════════════════════════════════ */}
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 120, damping: 20 }}
                className="fixed top-0 left-0 right-0 z-[100]"
            >
                <div className={`w-full transition-all duration-500 ease-in-out
                    ${isScrolled ? 'px-4 sm:px-8 pt-3 pb-2' : 'px-0 pt-0 pb-0'}`}
                >
                    <div className={`flex items-center justify-between gap-4
                        transition-all duration-500 ease-in-out
                        ${isScrolled
                            ? 'bg-black/50 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-white/10 px-5 py-2.5'
                            : 'bg-gradient-to-b from-black/30 to-transparent px-6 sm:px-10 py-4'}`}
                    >

                        {/* ── Brand ───────────────────────────────────── */}
                        <Link href="/patient/dashboard" className="flex items-center gap-3 shrink-0">
                            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-md flex-shrink-0">
                                {!logoError ? (
                                    <Image
                                        src="/images/Logo.png" alt="Nauli Dental Logo"
                                        width={40} height={40}
                                        className="object-cover w-full h-full"
                                        onError={() => setLogoError(true)}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                        <span className="text-white font-bold text-xl">N</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="text-lg font-black tracking-tight text-white">
                                    Nauli<span className={isScrolled ? 'text-emerald-400' : 'text-emerald-300'}>Dental</span>
                                </span>
                                <span className={`text-[9px] font-semibold tracking-wider uppercase transition-colors duration-500
                                    ${isScrolled ? 'text-slate-400' : 'text-white/60'}`}>
                                    Patient Portal
                                </span>
                            </div>
                        </Link>

                        {/* ── Nav Items Desktop ────────────────────────── */}
                        <div className="hidden lg:flex items-center justify-center flex-1">
                            <div className="flex items-center gap-1">
                                {navItems.map(item => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link key={item.href} href={item.href}>
                                            <motion.div
                                                whileHover={{ scale: 1.04 }}
                                                whileTap={{ scale: 0.97 }}
                                                className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl
                                                    transition-all duration-200 cursor-pointer
                                                    ${isActive
                                                        ? isScrolled ? 'text-emerald-400' : 'text-white font-semibold'
                                                        : isScrolled
                                                            ? 'text-slate-300 hover:text-white hover:bg-white/10'
                                                            : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                                            >
                                                <item.icon size={15} className="flex-shrink-0" />
                                                <span>{item.name}</span>
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeNav"
                                                        className={`absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full
                                                            ${isScrolled ? 'bg-emerald-400' : 'bg-white'}`}
                                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                                    />
                                                )}
                                            </motion.div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── Action Kanan ─────────────────────────────── */}
                        <div className="flex items-center gap-2 shrink-0">

                            {/* ── Quick Access: Janji & Rekam Medis ──── */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setIsQuickOpen(!isQuickOpen);
                                        setIsProfileOpen(false);
                                        setIsNotifOpen(false);
                                    }}
                                    className={`relative p-2 rounded-xl transition-all
                                        ${isScrolled
                                            ? 'text-slate-400 hover:bg-white/10 hover:text-white'
                                            : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                                >
                                    <ClipboardList size={18} />
                                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                </motion.button>

                                <AnimatePresence>
                                    {isQuickOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                                            className="absolute right-0 mt-2 w-64 bg-black/60 backdrop-blur-xl rounded-2xl
                                                shadow-2xl shadow-black/30 border border-white/10 overflow-hidden z-[110]"
                                        >
                                            <div className="px-5 py-3 border-b border-white/8">
                                                <p className="text-xs font-black text-white/50 uppercase tracking-widest">Aktivitas Saya</p>
                                            </div>
                                            <div className="p-1.5 space-y-0.5">
                                                {[
                                                    { href: '/patient/appointments', icon: CalendarCheck, label: 'Janji Temu', sub: 'Kelola reservasi Anda' },
                                                    { href: '/patient/records', icon: FileText, label: 'Rekam Medis', sub: 'Riwayat perawatan Anda' },
                                                ].map(item => (
                                                    <Link key={item.href} href={item.href} onClick={() => setIsQuickOpen(false)}>
                                                        <button className="w-full px-4 py-3 text-left hover:bg-white/10 rounded-xl flex items-center gap-4 transition-all group cursor-pointer">
                                                            <div className="w-9 h-9 bg-white/8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/15 transition-all">
                                                                <item.icon size={16} className="text-white/70 group-hover:text-emerald-400 transition-colors" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-white leading-tight">{item.label}</p>
                                                                <p className="text-[11px] text-white/40 mt-0.5">{item.sub}</p>
                                                            </div>
                                                        </button>
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* ── FIX 2: Bell dengan dropdown notifikasi ── */}
                            <div className="relative" ref={notifRef}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsNotifOpen(prev => !prev);
                                        setIsProfileOpen(false);
                                        setIsQuickOpen(false);
                                    }}
                                    className={`relative p-2 rounded-xl transition-all z-50
                                        ${isNotifOpen
                                            ? 'text-emerald-400 bg-white/10'
                                            : isScrolled
                                                ? 'text-slate-400 hover:bg-white/10 hover:text-white'
                                                : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                                >
                                    <Bell size={18} />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#0a0a0a]" />
                                    )}
                                </motion.button>

                                {/* Dropdown Notifikasi */}
                                <AnimatePresence>
                                    {isNotifOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                                            className="absolute right-0 mt-3 w-80 bg-[#121212]/95 backdrop-blur-xl
                                                border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-[110]"
                                        >
                                            {/* Header */}
                                            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                                                <h4 className="text-xs font-black text-white uppercase tracking-widest">
                                                    Pemberitahuan
                                                </h4>
                                                {unreadCount > 0 && (
                                                    <span className="text-[9px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">
                                                        {unreadCount} Baru
                                                    </span>
                                                )}
                                            </div>

                                            {/* List */}
                                            <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                                                {notifications.length === 0 ? (
                                                    <div className="p-10 text-center space-y-2">
                                                        <Bell size={24} className="mx-auto text-white/10" />
                                                        <p className="text-[10px] text-white/30 uppercase font-bold tracking-tighter">
                                                            Belum ada aktivitas baru
                                                        </p>
                                                    </div>
                                                ) : (
                                                    notifications.map(n => (
                                                        <div key={n.id}
                                                            className="p-4 hover:bg-white/5 transition-colors cursor-default group"
                                                        >
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${n.color || 'bg-emerald-500'}`} />
                                                                <p className="text-[11px] font-black text-white uppercase group-hover:text-emerald-400 transition-colors">
                                                                    {n.title}
                                                                </p>
                                                            </div>
                                                            <p className="text-[10px] text-white/50 leading-relaxed">{n.desc}</p>
                                                            {n.time && (
                                                                <p className="text-[8px] text-emerald-500/50 mt-2 font-bold italic">{n.time}</p>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                            </div>

                                            {/* Footer */}
                                            <div className="p-3 border-t border-white/5 bg-white/3">
                                                <button
                                                    onClick={() => {
                                                        setNotifications([]);
                                                        setUnreadCount(0);
                                                        // Reset tracking sehingga notif bisa muncul lagi jika status berubah
                                                        seenNotifIds.current.clear();
                                                    }}
                                                    className="w-full text-[10px] font-bold text-white/30 hover:text-white/60 transition-colors py-1"
                                                >
                                                    Tandai semua sudah dibaca
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* ── Profile Button ───────────────────────── */}
                            <div className="relative">
                                {loggedIn ? (
                                    <>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                setIsProfileOpen(prev => !prev);
                                                setIsNotifOpen(false);
                                                setIsQuickOpen(false);
                                            }}
                                            className="flex items-center gap-2 pl-2 pr-2 py-1 rounded-full transition-all duration-300 bg-white/10 border border-white/20 hover:bg-white/20"
                                        >
                                            <div className="relative flex-shrink-0">
                                                <div className="w-7 h-7 rounded-full ring-2 ring-emerald-400/50 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-bold text-[10px]">
                                                    {getInitials(user.name)}
                                                </div>
                                                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-white" />
                                            </div>
                                            <div className="hidden sm:block text-left pr-1">
                                                <p className="text-[11px] font-semibold leading-tight text-white">{user.name}</p>
                                                <p className="text-[9px] font-medium text-emerald-400">Patient Member</p>
                                            </div>
                                            <ChevronDown
                                                size={12}
                                                className={`text-white/60 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}
                                            />
                                        </motion.button>

                                        <AnimatePresence>
                                            {isProfileOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                                    transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                                                    className="absolute right-0 mt-2 w-64 bg-[#1a1a1a]/95 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/50 border border-white/8 overflow-hidden z-[110]"
                                                >
                                                    <div className="bg-gradient-to-br from-emerald-600 to-teal-600 px-4 py-3 text-white">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                                                                {getInitials(user.name)}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-sm leading-tight">{user.name}</p>
                                                                <p className="text-[10px] text-emerald-100 mt-0.5">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="px-3 py-3 space-y-1">
                                                        <Link href="/patient/profile" onClick={() => setIsProfileOpen(false)}>
                                                            <button className="w-full px-3 py-2 text-left text-sm font-medium text-slate-300 hover:bg-white/5 rounded-xl flex items-center gap-3 transition-all">
                                                                <User size={14} className="text-emerald-500" /> Profil Saya
                                                            </button>
                                                        </Link>
                                                        <Link href="/register" onClick={() => setIsProfileOpen(false)}>
                                                            <button className="w-full px-3 py-2 text-left text-sm font-medium text-emerald-400 hover:bg-white/5 rounded-xl flex items-center gap-3 transition-all">
                                                                <UserPlus size={14} /> Daftar Akun Baru
                                                            </button>
                                                        </Link>
                                                        <div className="h-px bg-white/5 mx-2 my-1" />
                                                        <button
                                                            onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                                                            className="w-full px-3 py-2 text-left text-sm font-semibold text-red-500 hover:bg-red-500/10 rounded-xl flex items-center gap-3 transition-all"
                                                        >
                                                            <LogOut size={14} /> Keluar Portal
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </>
                                ) : (
                                    // ── Tampilan untuk guest (belum login) ──
                                    <Link href="/login">
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[12px] font-bold transition-all">
                                            Masuk
                                        </button>
                                    </Link>
                                )}
                            </div>

                            {/* Mobile hamburger */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 rounded-xl text-white/70 hover:bg-white/10 transition-all"
                            >
                                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* ── Mobile Menu ──────────────────────────────────────────── */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="lg:hidden bg-white/95 backdrop-blur-xl shadow-lg overflow-hidden"
                        >
                            <div className="px-4 py-3 space-y-0.5">
                                {navItems.map((item, idx) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <motion.div key={item.href}
                                            initial={{ opacity: 0, x: -16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.04 }}
                                        >
                                            <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all
                                                    ${isActive ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
                                            >
                                                <span>{item.name}</span>
                                                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                                <div className="pt-3 mt-1 border-t border-slate-100 space-y-0.5">
                                    {[
                                        { href: '/patient/profile', icon: User, label: 'Profil Saya', style: 'text-slate-600' },
                                        { href: '/patient/settings', icon: Settings, label: 'Pengaturan', style: 'text-slate-600' },
                                        { href: '/register', icon: UserPlus, label: 'Daftar Akun Baru', style: 'text-emerald-600' },
                                    ].map(item => (
                                        <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all ${item.style}`}>
                                                <item.icon size={16} className="text-slate-400" /> {item.label}
                                            </div>
                                        </Link>
                                    ))}
                                    <button
                                        onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
                                    >
                                        <LogOut size={16} /> Keluar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* ── FIX 3: Backdrop — mencakup semua 3 dropdown ─────────────── */}
            {(isProfileOpen || isQuickOpen || isNotifOpen) && (
                <div
                    className="fixed inset-0 z-[90] bg-transparent"
                    onClick={() => {
                        setIsProfileOpen(false);
                        setIsQuickOpen(false);
                        setIsNotifOpen(false);
                    }}
                />
            )}

            {/* ── KONTEN ──────────────────────────────────────────────────── */}
            <main className={`${isHeroPage ? 'pt-0' : 'pt-[72px]'} transition-all duration-500`}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* ── LOGOUT MODAL ────────────────────────────────────────────── */}
            <AnimatePresence>
                {showLogoutModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
                            onClick={() => setShowLogoutModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
                        >
                            <div className="bg-[#0D1F16] border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                                <div className="bg-gradient-to-r from-emerald-700 to-teal-700 px-6 py-4 flex items-center gap-3">
                                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                                        <LogOut size={17} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white uppercase tracking-wide">Keluar Portal</p>
                                        <p className="text-[10px] text-emerald-200 font-bold">Nauli Dental Patient Portal</p>
                                    </div>
                                </div>
                                <div className="px-6 py-5 space-y-4">
                                    {/* KOTAK USER DINAMIS */}
                                    <div className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl p-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-black text-base shrink-0 shadow-lg">
                                            {/* INISIAL DINAMIS */}
                                            {getInitials(user.name)}
                                        </div>
                                        <div>
                                            {/* NAMA DINAMIS */}
                                            <p className="text-sm font-black text-white">{user.name}</p>
                                            {/* EMAIL DINAMIS */}
                                            <p className="text-[10px] text-white/40 mt-0.5">{user.email}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-white/60 leading-relaxed">
                                        Anda akan keluar dari <span className="text-emerald-400 font-bold">Portal Pasien</span>. Sesi Anda akan diakhiri dan diarahkan ke halaman login.
                                    </p>
                                </div>
                                <div className="px-6 pb-5 flex gap-3">
                                    <button
                                        onClick={() => setShowLogoutModal(false)}
                                        className="flex-1 py-2.5 rounded-xl border border-white/15 text-white/70 text-sm font-bold hover:bg-white/8 transition-all"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={executeLogout}
                                        className="flex-1 py-2.5 rounded-xl bg-red-500/90 hover:bg-red-600 text-white text-sm font-black uppercase tracking-wide transition-all shadow-lg shadow-red-900/30 active:scale-95"
                                    >
                                        Ya, Keluar
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