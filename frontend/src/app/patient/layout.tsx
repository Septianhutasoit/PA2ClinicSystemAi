'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, ChevronDown, LogOut, Settings, User, Home,
    Menu, X, UserPlus, Building2, UsersRound,
    LayoutDashboard, CalendarCheck, FileText,
    Stethoscope, Users, ClipboardList, Info, Target
} from 'lucide-react';

export default function PatientLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const [isQuickOpen, setIsQuickOpen] = useState(false);

    // 1. PROTEKSI ROLE PASIEN
    useEffect(() => {
        const token = localStorage.getItem('token') || Cookies.get('token');
        const role = localStorage.getItem('user_role') || Cookies.get('role');
        if (!token || role?.toLowerCase() !== 'patient') {
            router.push('/login');
        } else {
            setIsAuthorized(true);
        }
    }, [router, pathname]);

    // 2. SCROLL EFFECT — threshold 80px agar tidak terlalu sensitif
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 80);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        if (confirm('Yakin Keluar dari Portal Pasien?')) {
            localStorage.clear();
            Cookies.remove('token', { path: '/' });
            Cookies.remove('role', { path: '/' });
            document.cookie.split(';').forEach(c => {
                document.cookie = c
                    .replace(/^ +/, '')
                    .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
            });
            router.push('/login');
        }
    };

    const navItems = [
        { name: 'Beranda', href: '/patient/dashboard', icon: Home },
        { name: 'Layanan', href: '/patient/services', icon: Stethoscope },
        { name: 'Nauli Dental', href: '/patient/about', icon: Building2 }, 
        { name: 'Tim Kami', href: '/patient/doctors', icon: UsersRound }, 
        { name: 'Visi & Misi', href: '/patient/visiMisi', icon: Target },
        // { name: 'Janji Temu',  href: '/patient/appointments', icon: CalendarCheck },
        // { name: 'Rekam Medis', href: '/patient/records',      icon: FileText },
    ];

    if (!isAuthorized) return null;

    const isHeroPage = [
        '/patient/dashboard',
        '/patient/about',
        '/patient/appointments',
        '/patient/records',
        '/patient/services',
        '/patient/visiMisi',
        '/patient/doctors',
    ].some(p => pathname.startsWith(p));

    return (
        <div className="min-h-screen font-sans overflow-x-clip bg-[#0a0a0a]">

            {/* ── NAVBAR ──────────────────────────────────────────────────── */}
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 120, damping: 20 }}
                className="fixed top-0 left-0 right-0 z-[100]"
            >
                {/*
                  Wrapper luar: selalu full width, background transparan.
                  Padding horizontal berubah smooth saat scroll.
                */}
                <div className={`w-full transition-all duration-500 ease-in-out ${isScrolled ? 'px-4 sm:px-8 pt-3 pb-2' : 'px-0 pt-0 pb-0'
                    }`}>
                    {/*
                      Inner bar: yang berubah bentuk.
                      Belum scroll  → full width, border bawah tipis.
                      Sudah scroll  → rounded pill, shadow, sedikit lebih kecil tingginya.
                    */}
                    <div className={`flex items-center justify-between gap-4 transition-all duration-500 ease-in-out ${isScrolled
                        ? 'bg-black/50 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-white/10 px-5 py-2.5'
                        : 'bg-gradient-to-b from-black/30 to-transparent px-6 sm:px-10 py-4'
                        }`}>

                        {/* ── Brand ─────────────────────────────────────── */}
                        <Link href="/patient/dashboard" className="flex items-center gap-3 shrink-0">
                            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-md flex-shrink-0">
                                {!logoError ? (
                                    <Image
                                        src="/images/Logo1.png"
                                        alt="Nauli Dental Logo"
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
                                <span className={`text-lg font-black tracking-tight transition-colors duration-500 ${isScrolled ? 'text-white' : 'text-white'}`}>
                                    Nauli<span className={`${isScrolled ? 'text-emerald-400' : 'text-emerald-300'}`}>Dental</span>
                                </span>
                                <span className={`text-[9px] font-semibold tracking-wider uppercase transition-colors duration-500 ${isScrolled ? 'text-slate-400' : 'text-white/60'}`}>
                                    Patient Portal
                                </span>
                            </div>
                        </Link>

                        {/* ── Nav Items Desktop ─────────────────────────── */}
                        <div className="hidden lg:flex items-center justify-center flex-1">
                            <div className="flex items-center gap-1">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link key={item.href} href={item.href}>
                                            <motion.div
                                                whileHover={{ scale: 1.04 }}
                                                whileTap={{ scale: 0.97 }}
                                                className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${isActive
                                                        ? isScrolled ? 'text-emerald-400' : 'text-white font-semibold'
                                                        : isScrolled
                                                            ? 'text-slate-300 hover:text-white hover:bg-white/10'
                                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                                    }`}
                                            >
                                                <item.icon size={15} className="flex-shrink-0" />
                                                <span>{item.name}</span>
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeNav"
                                                        className={`absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full ${isScrolled ? 'bg-emerald-400' : 'bg-white'
                                                            }`}
                                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                                    />
                                                )}
                                            </motion.div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── Action Kanan ──────────────────────────────── */}
                        <div className="flex items-center gap-2 shrink-0">

                            {/* ── Quick Access: Janji Temu & Rekam Medis ── */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsQuickOpen(!isQuickOpen)}
                                    className={`relative p-2 rounded-xl transition-all ${isScrolled
                                            ? 'text-slate-400 hover:bg-white/10 hover:text-white'
                                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <ClipboardList size={18} />
                                    {/* Dot indikator */}
                                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                </motion.button>

                                {/* Dropdown */}
                                <AnimatePresence>
                                    {isQuickOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                                            className="absolute right-0 mt-2 w-64 bg-black/60 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/30 border border-white/10 overflow-hidden z-50"
                                        >
                                            {/* Header */}
                                            <div className="px-5 py-3 border-b border-white/8">
                                                <p className="text-xs font-black text-white/50 uppercase tracking-widest">Aktivitas Saya</p>
                                            </div>
                                            <div className="p-1.5 space-y-0.5">
                                                <Link
                                                    href="/patient/appointments"
                                                    onClick={() => setIsQuickOpen(false)}
                                                >
                                                    <button className="w-full px-4 py-3 text-left hover:bg-white/10 rounded-xl flex items-center gap-4 transition-all group cursor-pointer">
                                                        <div className="w-9 h-9 bg-white/8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/15 transition-all">
                                                            <CalendarCheck size={16} className="text-white/70 group-hover:text-emerald-400 transition-colors" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white leading-tight">Janji Temu</p>
                                                            <p className="text-[11px] text-white/40 mt-0.5">Kelola reservasi Anda</p>
                                                        </div>
                                                    </button>
                                                </Link>
                                                <Link
                                                    href="/patient/records"
                                                    onClick={() => setIsQuickOpen(false)}
                                                >
                                                    <button className="w-full px-4 py-3 text-left hover:bg-white/10 rounded-xl flex items-center gap-4 transition-all group cursor-pointer">
                                                        <div className="w-9 h-9 bg-white/8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/15 transition-all">
                                                            <FileText size={16} className="text-white/70 group-hover:text-emerald-400 transition-colors" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white leading-tight">Rekam Medis</p>
                                                            <p className="text-[11px] text-white/40 mt-0.5">Riwayat perawatan Anda</p>
                                                        </div>
                                                    </button>
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Bell */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`relative p-2 rounded-xl transition-all ${isScrolled ? 'text-slate-400 hover:bg-white/10 hover:text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <Bell size={18} />
                                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                            </motion.button>

                            {/* Profile Button */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className={`flex items-center gap-2 pl-2 pr-2 py-1 rounded-full transition-all duration-300 ${isScrolled
                                            ? 'bg-white/10 border border-white/20 hover:bg-white/20'
                                            : 'bg-white/10 border border-white/20 hover:bg-white/20'
                                        }`}
                                >
                                    <div className="relative flex-shrink-0">
                                        <div className="w-7 h-7 rounded-full ring-2 ring-emerald-400/50 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500">
                                            <span className="text-white font-bold text-[10px]">SA</span>
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-white" />
                                    </div>
                                    <div className="hidden sm:block text-left pr-1">
                                        <p className="text-[11px] font-semibold leading-tight text-white">Septian Adi</p>
                                        <p className="text-[9px] font-medium text-emerald-400">Member Gold</p>
                                    </div>
                                    <ChevronDown
                                        size={12}
                                        className={`text-white/60 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}
                                    />
                                </motion.button>

                                {/* Dropdown */}
                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                                            className="absolute right-0 mt-2 w-64 bg-[#1a1a1a]/95 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/50 border border-white/8 overflow-hidden z-50"
                                        >
                                            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 px-4 py-3 text-white">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">SA</div>
                                                    <div>
                                                        <p className="font-semibold text-sm leading-tight">Septian Adi</p>
                                                        <p className="text-[10px] text-emerald-100 mt-0.5">septian@email.com</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-3 py-3 space-y-1">
                                                <Link href="/patient/profile" onClick={() => setIsProfileOpen(false)}>
                                                    <button className="w-full px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-all">
                                                        <User size={14} className="text-emerald-500" /> Profil Saya
                                                    </button>
                                                </Link>
                                                <Link href="/patient/settings" onClick={() => setIsProfileOpen(false)}>
                                                    <button className="w-full px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-all">
                                                        <Settings size={14} className="text-emerald-500" /> Pengaturan
                                                    </button>
                                                </Link>
                                                <Link href="/register" onClick={() => setIsProfileOpen(false)}>
                                                    <button className="w-full px-3 py-2 text-left text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-xl flex items-center gap-3 transition-all">
                                                        <UserPlus size={14} className="text-emerald-500" /> Daftar Akun Baru
                                                    </button>
                                                </Link>
                                                <div className="h-px bg-slate-100 mx-2" />
                                                <button
                                                    onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                                                    className="w-full px-3 py-2 text-left text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-all"
                                                >
                                                    <LogOut size={14} /> Keluar Portal
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Mobile hamburger */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-all"
                            >
                                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* ── Mobile Menu ───────────────────────────────────────── */}
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
                                        <motion.div
                                            key={item.href}
                                            initial={{ opacity: 0, x: -16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.04 }}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                                        ? 'bg-emerald-50 text-emerald-600'
                                                        : 'text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <span>{item.name}</span>
                                                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                                <div className="pt-3 mt-1 border-t border-slate-100 space-y-0.5">
                                    <Link href="/patient/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
                                            <User size={16} className="text-slate-400" /> Profil Saya
                                        </div>
                                    </Link>
                                    <Link href="/patient/settings" onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
                                            <Settings size={16} className="text-slate-400" /> Pengaturan
                                        </div>
                                    </Link>
                                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-all">
                                            <UserPlus size={16} className="text-emerald-500" /> Daftar Akun Baru
                                        </div>
                                    </Link>
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

            {/* Backdrop dropdown */}
            {(isProfileOpen || isQuickOpen) && (
                <div className="fixed inset-0 z-40" onClick={() => {
                    setIsProfileOpen(false);
                    setIsQuickOpen(false);
                }} />
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
        </div>
    );
}