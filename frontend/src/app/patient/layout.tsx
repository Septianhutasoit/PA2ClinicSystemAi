'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, ChevronDown, LogOut, Settings, User, Sparkles,
    Menu, X, UserPlus
} from 'lucide-react';

export default function PatientLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [logoError, setLogoError] = useState(false);

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

    // 2. SCROLL EFFECT - Navbar blur hijau tua saat scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        if (confirm("Keluar dari Portal Pasien?")) {
            localStorage.clear();
            Cookies.remove('token');
            Cookies.remove('role');
            router.push('/login');
        }
    };

    // Navigasi - HANYA TEKS, tanpa icon
    const navItems = [
        { name: 'Dashboard', href: '/patient/dashboard' },
        { name: 'Janji Temu', href: '/patient/appointments' },
        { name: 'Rekam Medis', href: '/patient/records' },
        { name: 'Layanan', href: '/patient/services' },
        { name: 'Tim Kami', href: '/patient/doctors' },
    ];

    if (!isAuthorized) return null;

    // Cek apakah ini halaman dashboard (yang butuh fullscreen hero)
    const isHeroPage = pathname === '/patient/dashboard';

    return (
        <div className="min-h-screen bg-white font-sans overflow-x-hidden">

            {/* --- NAVBAR DINAMIS (Blur hijau tua saat scroll) --- */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className={`fixed top-0 w-full z-[100] transition-all duration-500 ${isScrolled
                        ? 'bg-emerald-800/70 backdrop-blur-md border-b border-emerald-700/30 shadow-md py-2'
                        : 'bg-transparent border-transparent py-4'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-4">

                        {/* Brand Section - KIRI */}
                        <Link href="/patient/dashboard" className="flex items-center gap-3 shrink-0 group">
                            <div className="relative">
                                <div className={`w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center transition-all duration-300 ${isScrolled
                                        ? 'bg-white shadow-md'
                                        : 'bg-white shadow-lg'
                                    }`}>
                                    {!logoError ? (
                                        <Image
                                            src="/images/logo1.png"
                                            alt="Nauli Dental Logo"
                                            width={40}
                                            height={40}
                                            className="object-cover w-full h-full"
                                            onError={() => setLogoError(true)}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                            <span className="text-white font-bold text-xl">N</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className={`text-lg font-black tracking-tight transition-colors duration-300 ${isScrolled ? 'text-white' : 'text-white'
                                    }`}>
                                    Nauli<span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">Dental</span>
                                </span>
                                <span className={`text-[9px] font-semibold tracking-wider transition-colors duration-300 ${isScrolled ? 'text-emerald-200' : 'text-white/70'
                                    }`}>
                                    PATIENT PORTAL
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation - TENGAH (hanya teks, tanpa icon) */}
                        <div className="hidden lg:flex items-center justify-end flex-1">
                            <div className="flex items-center gap-3">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link key={item.href} href={item.href}>
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer
                    ${isActive
                                                        ? isScrolled
                                                            ? 'text-white'  // Active saat scroll: PUTIH
                                                            : 'text-emerald-600'  // Active sebelum scroll: HIJAU
                                                        : isScrolled
                                                            ? 'text-white/80 hover:text-white'  // Non-active saat scroll: PUTIH TRANSPARAN
                                                            : 'text-emerald-500/70 hover:text-emerald-600'  // Non-active sebelum scroll: HIJAU TRANSPARAN
                                                    }`}
                                            >
                                                <span>{item.name}</span>
                                                {isActive && !isScrolled && (
                                                    <motion.div
                                                        layoutId="activeNav"
                                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full"
                                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                    />
                                                )}
                                                {isActive && isScrolled && (
                                                    <motion.div
                                                        layoutId="activeNavScrolled"
                                                        className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-white rounded-full"
                                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                    />
                                                )}
                                            </motion.div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Action Section - KANAN (rapat ke profil) */}
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            {/* Notification Bell */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`relative p-2 rounded-full transition-all duration-200 ${isScrolled
                                        ? 'text-slate-500 hover:bg-slate-100'
                                        : 'text-white/80 hover:bg-white/10'
                                    }`}
                            >
                                <Bell size={18} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                            </motion.button>

                            {/* Profile Dropdown - LANGSUNG RAPAT */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className={`flex items-center gap-2 p-1 pl-2 rounded-full transition-all duration-200 ${isScrolled
                                            ? 'bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm hover:border-emerald-300'
                                            : 'bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20'
                                        }`}
                                >
                                    <div className="relative">
                                        <div className={`w-8 h-8 rounded-full ring-2 overflow-hidden flex items-center justify-center ${isScrolled
                                                ? 'ring-emerald-500/50 bg-gradient-to-br from-emerald-500 to-teal-500'
                                                : 'ring-white/30 bg-gradient-to-br from-emerald-600 to-teal-600'
                                            }`}>
                                            <span className="text-white font-bold text-xs">SA</span>
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className={`text-[11px] font-semibold leading-tight ${isScrolled ? 'text-slate-700' : 'text-white'}`}>
                                            Septian Adi
                                        </p>
                                        <p className={`text-[8px] font-medium ${isScrolled ? 'text-emerald-600' : 'text-emerald-300'}`}>
                                            Member Gold
                                        </p>
                                    </div>
                                    <ChevronDown size={12} className={`transition-transform duration-200 mr-1 ${isProfileOpen ? 'rotate-180' : ''} ${isScrolled ? 'text-slate-400' : 'text-white/60'}`} />
                                </motion.button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ type: "spring", damping: 20 }}
                                            className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50"
                                        >
                                            {/* Profile Header */}
                                            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-white">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                                                        <span className="text-white font-bold text-md">SA</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm">Septian Adi</p>
                                                        <p className="text-[10px] text-emerald-100">septian@email.com</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="p-1">
                                                <Link href="/patient/profile" onClick={() => setIsProfileOpen(false)}>
                                                    <button className="w-full px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-3 transition-all">
                                                        <User size={14} className="text-emerald-500" />
                                                        <span>Profil Saya</span>
                                                    </button>
                                                </Link>
                                                <Link href="/patient/settings" onClick={() => setIsProfileOpen(false)}>
                                                    <button className="w-full px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-3 transition-all">
                                                        <Settings size={14} className="text-emerald-500" />
                                                        <span>Pengaturan</span>
                                                    </button>
                                                </Link>
                                                <Link href="/register" onClick={() => setIsProfileOpen(false)}>
                                                    <button className="w-full px-3 py-2 text-left text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center gap-3 transition-all">
                                                        <UserPlus size={14} className="text-emerald-500" />
                                                        <span>Daftar Akun Baru</span>
                                                    </button>
                                                </Link>
                                                <div className="h-px bg-slate-100 my-1" />
                                                <button
                                                    onClick={() => {
                                                        setIsProfileOpen(false);
                                                        handleLogout();
                                                    }}
                                                    className="w-full px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-3 transition-all"
                                                >
                                                    <LogOut size={14} />
                                                    <span>Keluar Portal</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Mobile Menu Button - HAPUS ICON GESER, LANGSUNG MENU */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`lg:hidden p-2 rounded-lg transition-all ${isScrolled
                                        ? 'text-emerald-200 hover:bg-emerald-800/50'
                                        : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-lg"
                        >
                            <div className="px-4 py-3 space-y-1">
                                {navItems.map((item, idx) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <motion.div
                                            key={item.href}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all
                                                    ${isActive
                                                        ? 'bg-emerald-50 text-emerald-600'
                                                        : 'text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <span>{item.name}</span>
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="mobileActive"
                                                        className="ml-auto w-1 h-5 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full"
                                                    />
                                                )}
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                                {/* Menu Profile di mobile */}
                                <div className="pt-3 mt-2 border-t border-slate-100">
                                    <Link href="/patient/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
                                            <User size={18} className="text-slate-400" />
                                            <span>Profil Saya</span>
                                        </div>
                                    </Link>
                                    <Link href="/patient/settings" onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
                                            <Settings size={18} className="text-slate-400" />
                                            <span>Pengaturan</span>
                                        </div>
                                    </Link>
                                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-emerald-600 hover:bg-emerald-50">
                                            <UserPlus size={18} className="text-emerald-500" />
                                            <span>Daftar Akun Baru</span>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            handleLogout();
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut size={18} />
                                        <span>Keluar Portal</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Backdrop for dropdowns */}
            {isProfileOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                />
            )}

            {/* --- AREA KONTEN --- */}
            <main className={`${isHeroPage ? 'pt-0' : 'pt-20'} transition-all duration-500`}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}