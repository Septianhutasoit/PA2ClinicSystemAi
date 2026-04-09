'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, ChevronDown, LogOut, Settings, User, Sparkles,
    Menu, X
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

    // 2. SCROLL EFFECT
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
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

    // Menu navigasi - HANYA TEKS, tanpa icon
    const navItems = [
        { name: 'Dashboard', href: '/patient/dashboard' },
        { name: 'Janji Temu', href: '/patient/appointments' },
        { name: 'Rekam Medis', href: '/patient/records' },
        { name: 'Layanan', href: '/patient/services' },
        { name: 'Tim Kami', href: '/patient/doctors' },
    ];

    if (!isAuthorized) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 font-sans">

            {/* --- NAVBAR SEDERHANA --- */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
                        ? 'bg-white/98 backdrop-blur-xl border-b border-slate-100 shadow-lg py-2'
                        : 'bg-white/95 backdrop-blur-md border-b border-slate-100/50 py-3'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-4">

                        {/* Brand Section - KIRI */}
                        <Link href="/patient/dashboard" className="flex items-center gap-3 group shrink-0">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative"
                            >
                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md">
                                    {!logoError ? (
                                        <Image
                                            src="/images/logo1.png"
                                            alt="Nauli Dental Logo"
                                            width={40}
                                            height={40}
                                            className="object-cover w-full h-full"
                                            priority
                                            onError={() => setLogoError(true)}
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                                            <span className="text-white font-bold text-xl">N</span>
                                        </div>
                                    )}
                                </div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm"
                                />
                            </motion.div>

                            <div className="hidden sm:flex flex-col leading-tight">
                                <span className="text-lg font-black tracking-tight text-slate-800">
                                    Nauli<span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"> Dental</span>
                                </span>
                                <span className="text-[9px] font-semibold tracking-wider text-slate-400">
                                    PATIENT PORTAL
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation - TENGAH (HANYA TEKS) */}
                        <div className="hidden lg:flex items-center justify-center flex-1">
                            <div className="flex items-center gap-1">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link key={item.href} href={item.href}>
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`relative px-4 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 cursor-pointer
                                                    ${isActive
                                                        ? 'text-indigo-600 bg-indigo-50'
                                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <span>{item.name}</span>
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeNav"
                                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full"
                                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                    />
                                                )}
                                            </motion.div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Action Section - KANAN */}
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            {/* Notification Bell */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200"
                            >
                                <Bell size={18} />
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"
                                />
                            </motion.button>

                            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 p-1 pl-2 bg-white border border-slate-200 rounded-full hover:border-indigo-300 transition-all duration-200 shadow-sm"
                                >
                                    <div className="relative">
                                        <div className="w-8 h-8 rounded-full ring-2 ring-indigo-100 overflow-hidden bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
                                            <span className="text-white font-bold text-xs">SA</span>
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-[11px] font-bold text-slate-700 leading-tight">Septian Adi</p>
                                        <p className="text-[8px] font-semibold text-indigo-600">Member Gold</p>
                                    </div>
                                    <ChevronDown size={12} className={`text-slate-400 transition-transform duration-200 mr-1 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </motion.button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <>
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ type: "spring", damping: 20 }}
                                                className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50"
                                            >
                                                {/* Profile Header */}
                                                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 text-white">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                                                            <span className="text-white font-bold text-md">SA</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm">Septian Adi Nugroho</p>
                                                            <p className="text-[10px] text-indigo-100">septian@email.com</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Menu Items */}
                                                <div className="p-1">
                                                    <Link href="/patient/profile" onClick={() => setIsProfileOpen(false)}>
                                                        <button className="w-full px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-3 transition-all">
                                                            <User size={14} className="text-indigo-500" />
                                                            <span>My Profile</span>
                                                        </button>
                                                    </Link>
                                                    <Link href="/patient/settings" onClick={() => setIsProfileOpen(false)}>
                                                        <button className="w-full px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-3 transition-all">
                                                            <Settings size={14} className="text-indigo-500" />
                                                            <span>Settings</span>
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
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Mobile Menu Button */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
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
                            className="lg:hidden bg-white border-t border-slate-100 shadow-lg"
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
                                                className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all
                                                    ${isActive
                                                        ? 'bg-indigo-50 text-indigo-600'
                                                        : 'text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <span>{item.name}</span>
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="mobileActive"
                                                        className="ml-auto w-1 h-5 bg-gradient-to-b from-indigo-600 to-blue-600 rounded-full"
                                                    />
                                                )}
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                                {/* Menu Profile di mobile */}
                                <div className="pt-3 mt-2 border-t border-slate-100">
                                    <Link href="/patient/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
                                            <User size={18} className="text-slate-400" />
                                            <span>My Profile</span>
                                        </div>
                                    </Link>
                                    <Link href="/patient/settings" onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
                                            <Settings size={18} className="text-slate-400" />
                                            <span>Settings</span>
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

            {/* --- AREA KONTEN (PAGES) --- */}
            <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}